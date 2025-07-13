-- 채널 테이블
CREATE TABLE IF NOT EXISTS channels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(10) DEFAULT '📺',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 컨텐츠 테이블
CREATE TABLE IF NOT EXISTS contents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'uploaded')),
    original_image_url TEXT,
    modified_image_url TEXT,
    difference_image_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 테이블 (추후 인증 기능 추가 시 사용)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_contents_channel_id ON contents(channel_id);
CREATE INDEX IF NOT EXISTS idx_contents_status ON contents(status);
CREATE INDEX IF NOT EXISTS idx_contents_created_at ON contents(created_at);
CREATE INDEX IF NOT EXISTS idx_channels_created_at ON channels(created_at);

-- RLS (Row Level Security) 설정 (추후 인증 기능 추가 시 활성화)
-- ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 샘플 데이터 삽입
INSERT INTO channels (name, icon, description) VALUES 
('틀찾쇼', '🎯', '재미있는 틀 찾기 게임 채널')
ON CONFLICT DO NOTHING;

-- 샘플 컨텐츠 삽입 (채널이 존재할 때만)
INSERT INTO contents (channel_id, title, description, status) 
SELECT 
    c.id,
    '틀찾쇼 에피소드 #001',
    '재미있는 틀 찾기 게임 첫 번째 에피소드',
    'pending'
FROM channels c WHERE c.name = '틀찾쇼'
ON CONFLICT DO NOTHING; 