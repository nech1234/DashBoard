import React, { useState, useEffect } from "react";
import "./TteulFindShow.css";

const TteulFindShow = ({ channel }) => {
  const [contentStage, setContentStage] = useState('generated'); // 'generated', 'approved', 'rejected'
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 샘플 컨텐츠 데이터
  const [contents, setContents] = useState([
    { 
      id: 1, 
      title: "틀찾쇼 에피소드 #001", 
      description: "재미있는 틀 찾기 게임 첫 번째 에피소드", 
      status: "generated",
      images: {
        original: "🏠", // 원본 이미지
        modified: "🏡", // 변경된 이미지
        difference: "🔍" // 변경된 장소/차이점
      }
    },
    { 
      id: 2, 
      title: "틀찾쇼 에피소드 #002", 
      description: "도전적인 틀 찾기 문제들", 
      status: "generated",
      images: {
        original: "🌳", 
        modified: "🌲", 
        difference: "📍"
      }
    },
    { 
      id: 3, 
      title: "틀찾쇼 에피소드 #003", 
      description: "시청자 참여 틀 찾기", 
      status: "approved",
      images: {
        original: "🚗", 
        modified: "🚙", 
        difference: "🎯"
      }
    },
    { 
      id: 4, 
      title: "틀찾쇼 에피소드 #004", 
      description: "특별 편집 버전", 
      status: "rejected",
      images: {
        original: "🌸", 
        modified: "🌺", 
        difference: "✨"
      }
    },
    { 
      id: 5, 
      title: "틀찾쇼 에피소드 #005", 
      description: "새로운 형식의 틀 찾기", 
      status: "generated",
      images: {
        original: "🎪", 
        modified: "🎭", 
        difference: "⭐"
      }
    },
  ]);

  // 단계별 컨텐츠 필터링
  const getFilteredContents = () => {
    return contents.filter(content => content.status === contentStage);
  };

  // 캐러셀 관련 함수들
  const filteredContents = getFilteredContents();
  const totalSlides = filteredContents.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // 터치 이벤트 처리
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // 단계 변경 시 슬라이드 초기화
  useEffect(() => {
    setCurrentSlide(0);
  }, [contentStage]);

  // 컨텐츠 상태 변경
  const moveToApproved = (contentId) => {
    setContents(prev => prev.map(content => 
      content.id === contentId ? { ...content, status: 'approved' } : content
    ));
  };

  const moveToRejected = (contentId) => {
    setContents(prev => prev.map(content => 
      content.id === contentId ? { ...content, status: 'rejected' } : content
    ));
  };

  const moveToGenerated = (contentId) => {
    setContents(prev => prev.map(content => 
      content.id === contentId ? { ...content, status: 'generated' } : content
    ));
  };

  // 단계별 설정
  const stageConfig = {
    generated: {
      title: "생성된 이미지",
      description: "새로 생성된 컨텐츠를 검토하고 승인/거절할 수 있습니다.",
      icon: "📝",
      color: "#3b82f6"
    },
    approved: {
      title: "승인된 이미지", 
      description: "승인된 컨텐츠들입니다. 업로드 대기 중이거나 이미 업로드된 컨텐츠입니다.",
      icon: "✅",
      color: "#10b981"
    },
    rejected: {
      title: "거절된 이미지",
      description: "거절된 컨텐츠들입니다. 다시 검토하거나 삭제할 수 있습니다.",
      icon: "❌", 
      color: "#ef4444"
    }
  };

  // 컨텐츠 카드 렌더링 함수
  const renderContentCard = (content) => (
    <div key={content.id} className="content-card">
      <div className="content-thumbnail">
        <div className="image-trio">
          <div className="image-container original">
            <div className="image-placeholder">
              {content.images.original}
            </div>
            <span className="image-label">원본</span>
          </div>
          <div className="image-container modified">
            <div className="image-placeholder">
              {content.images.modified}
            </div>
            <span className="image-label">변경</span>
          </div>
          <div className="image-container difference">
            <div className="image-placeholder">
              {content.images.difference}
            </div>
            <span className="image-label">차이점</span>
          </div>
        </div>
      </div>
      <h3>{content.title}</h3>
      <p>{content.description}</p>
      <div className="content-actions">
        {contentStage === 'generated' && (
          <>
            <button 
              className="action-btn approve"
              onClick={() => moveToApproved(content.id)}
            >
              ✅ 승인
            </button>
            <button 
              className="action-btn reject"
              onClick={() => moveToRejected(content.id)}
            >
              ❌ 거절
            </button>
            <button className="action-btn edit">✏️ 편집</button>
          </>
        )}
        {contentStage === 'approved' && (
          <>
            <button 
              className="action-btn reject"
              onClick={() => moveToRejected(content.id)}
            >
              ❌ 거절로 이동
            </button>
            <button 
              className="action-btn generated"
              onClick={() => moveToGenerated(content.id)}
            >
              📝 재검토
            </button>
            <button className="action-btn upload">🚀 업로드</button>
          </>
        )}
        {contentStage === 'rejected' && (
          <>
            <button 
              className="action-btn approve"
              onClick={() => moveToApproved(content.id)}
            >
              ✅ 승인으로 이동
            </button>
            <button 
              className="action-btn generated"
              onClick={() => moveToGenerated(content.id)}
            >
              📝 재검토
            </button>
            <button className="action-btn delete">🗑️ 삭제</button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="tteul-find-show">
      <div className="content-header">
        <h2>
          {channel.icon} {channel.name} 컨텐츠
        </h2>
        <p>이 채널의 컨텐츠를 관리하고 체리피킹할 수 있습니다.</p>
      </div>

      {/* 단계별 탭 */}
      <div className="stage-tabs">
        {Object.entries(stageConfig).map(([key, config]) => (
          <button
            key={key}
            className={`stage-tab ${contentStage === key ? 'active' : ''}`}
            onClick={() => setContentStage(key)}
            style={{ '--tab-color': config.color }}
          >
            <span className="stage-icon">{config.icon}</span>
            <span className="stage-title">{config.title}</span>
            <span className="content-count">
              ({contents.filter(c => c.status === key).length})
            </span>
          </button>
        ))}
      </div>

      {/* 현재 단계 정보 */}
      <div className="stage-info">
        <h3>{stageConfig[contentStage].icon} {stageConfig[contentStage].title}</h3>
        <p>{stageConfig[contentStage].description}</p>
      </div>
      
      {/* 컨텐츠 그리드 / 캐러셀 */}
      {filteredContents.length > 0 ? (
        <>
          {isMobile ? (
            /* 모바일 캐러셀 */
            <div className="mobile-carousel">
              {/* 상단 네비게이션 */}
              <div className="carousel-top-nav">
                {/* 슬라이드 카운터 */}
                <div className="slide-counter">
                  {currentSlide + 1} / {totalSlides}
                </div>
                
                {/* 캐러셀 네비게이션 */}
                <div className="carousel-nav">
                  <button 
                    className="nav-btn prev"
                    onClick={prevSlide}
                    disabled={totalSlides <= 1}
                  >
                    ←
                  </button>
                  
                  <div className="slide-indicators">
                    {filteredContents.map((_, index) => (
                      <button
                        key={index}
                        className={`indicator ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                      />
                    ))}
                  </div>
                  
                  <button 
                    className="nav-btn next"
                    onClick={nextSlide}
                    disabled={totalSlides <= 1}
                  >
                    →
                  </button>
                </div>
              </div>

              {/* 캐러셀 컨테이너 */}
              <div 
                className="carousel-container"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div 
                  className="carousel-track"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {filteredContents.map((content) => (
                    <div key={content.id} className="carousel-slide">
                      {renderContentCard(content)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* 데스크톱 그리드 */
            <div className="content-grid">
              {filteredContents.map((content) => renderContentCard(content))}
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">{stageConfig[contentStage].icon}</div>
          <h3>아직 {stageConfig[contentStage].title}가 없습니다</h3>
          <p>컨텐츠가 이 단계로 이동하면 여기에 표시됩니다.</p>
        </div>
      )}
    </div>
  );
};

export default TteulFindShow; 