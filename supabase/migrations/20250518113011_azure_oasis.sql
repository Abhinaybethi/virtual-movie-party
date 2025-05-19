/*
  # Initial schema for WatchTogether app

  1. New Tables
    - users
      - id (uuid, primary key)
      - name (text)
      - avatar (text)
      - created_at (timestamptz)
    
    - videos
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - url (text)
      - thumbnail (text)
      - uploaded_by (uuid, references users)
      - created_at (timestamptz)
    
    - rooms
      - id (uuid, primary key)
      - name (text)
      - video_id (uuid, references videos)
      - created_by (uuid, references users)
      - is_playing (boolean)
      - current_time (float8)
      - created_at (timestamptz)
    
    - room_viewers
      - room_id (uuid, references rooms)
      - user_id (uuid, references users)
      - joined_at (timestamptz)
      - PRIMARY KEY (room_id, user_id)
    
    - messages
      - id (uuid, primary key)
      - room_id (uuid, references rooms)
      - user_id (uuid, references users)
      - text (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  avatar text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Videos table
CREATE TABLE videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  url text NOT NULL,
  thumbnail text,
  uploaded_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Videos are readable by everyone"
  ON videos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can upload videos"
  ON videos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

-- Rooms table
CREATE TABLE rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  video_id uuid REFERENCES videos(id),
  created_by uuid REFERENCES users(id),
  is_playing boolean DEFAULT false,
  current_time float8 DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rooms are readable by everyone"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create rooms"
  ON rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creator can update room"
  ON rooms
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Room viewers table
CREATE TABLE room_viewers (
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (room_id, user_id)
);

ALTER TABLE room_viewers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Room viewers are readable by everyone"
  ON room_viewers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join rooms"
  ON room_viewers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms"
  ON room_viewers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages are readable by room viewers"
  ON messages
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM room_viewers
    WHERE room_viewers.room_id = messages.room_id
    AND room_viewers.user_id = auth.uid()
  ));

CREATE POLICY "Users can send messages in rooms they're in"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM room_viewers
      WHERE room_viewers.room_id = messages.room_id
      AND room_viewers.user_id = auth.uid()
    )
  );