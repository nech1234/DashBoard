import React, { useState, useEffect } from "react";
import { useContents } from "../hooks/useContents";
import { CONTENT_STATUS } from "../lib/supabase";
import "./TteulFindShow.css";

const TteulFindShow = ({ channel }) => {
  const [contentStage, setContentStage] = useState("PENDING"); // 'PENDING', 'APPROVED', 'REJECTED', 'UPLOADED'
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null); // 호버된 이미지 추적
  const [modalImage, setModalImage] = useState(null); // 모달로 보여줄 이미지

  // 데이터베이스 연동
  const {
    contents,
    loading,
    error,
    approveContent,
    rejectContent,
    resetContent,
    uploadContent,
    deleteContent,
  } = useContents(channel.id);

  // 디버깅을 위한 channel 데이터 출력
  console.log("Channel data:", channel);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 단계별 컨텐츠 필터링
  const getFilteredContents = () => {
    return contents.filter((content) => content.status === contentStage);
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

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && modalImage) {
        closeModal();
      }
    };

    if (modalImage) {
      document.addEventListener("keydown", handleEscKey);
      // 모달이 열려 있을 때 스크롤 방지
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [modalImage]);

  // 컨텐츠 상태 변경 핸들러
  const handleApprove = async (contentId) => {
    try {
      await approveContent(contentId);
    } catch (error) {
      console.error("승인 실패:", error);
    }
  };

  const handleReject = async (contentId) => {
    try {
      await rejectContent(contentId);
    } catch (error) {
      console.error("거절 실패:", error);
    }
  };

  const handleReset = async (contentId) => {
    try {
      await resetContent(contentId);
    } catch (error) {
      console.error("재검토 실패:", error);
    }
  };

  const handleUpload = async (contentId) => {
    try {
      await uploadContent(contentId);
    } catch (error) {
      console.error("업로드 실패:", error);
    }
  };

  const handleDelete = async (contentId) => {
    try {
      await deleteContent(contentId);
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  // 단계별 설정
  const stageConfig = {
    PENDING: {
      title: "대기 중인 이미지",
      description: "검토 대기 중인 컨텐츠를 승인하거나 거절할 수 있습니다.",
      icon: "⏳",
      color: "#f59e0b",
    },
    APPROVED: {
      title: "승인된 이미지",
      description: "승인된 컨텐츠들입니다. 업로드할 준비가 되었습니다.",
      icon: "✅",
      color: "#10b981",
    },
    REJECTED: {
      title: "거절된 이미지",
      description: "거절된 컨텐츠들입니다. 다시 검토하거나 삭제할 수 있습니다.",
      icon: "❌",
      color: "#ef4444",
    },
    UPLOADED: {
      title: "업로드 완료",
      description: "업로드가 완료된 컨텐츠들입니다.",
      icon: "🚀",
      color: "#6366f1",
    },
  };

  // 이미지 호버 핸들러
  const handleImageHover = (contentId, imageType) => {
    setHoveredImage({ contentId, imageType });
  };

  const handleImageLeave = () => {
    setHoveredImage(null);
  };

  // 이미지 클릭 핸들러
  const handleImageClick = (imageUrl, imageType) => {
    console.log(`${imageType} 이미지 URL:`, imageUrl);
    setModalImage({
      url: imageUrl,
      type: imageType,
    });
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
    setModalImage(null);
  };

  // 컨텐츠 카드 렌더링 함수
  const renderContentCard = (content) => {
    const isHovered = hoveredImage?.contentId === content.id;
    const hoveredType = hoveredImage?.imageType;

    // 디버깅을 위한 데이터 구조 출력
    console.log("Content data:", content);
    console.log("Content data.data:", content.data);

    // 다양한 필드명 지원을 위한 이미지 URL 추출
    const getImageUrl = (imageType) => {
      if (!content.data) return null;

      switch (imageType) {
        case "original":
          return (
            content.data.original_image_url ||
            content.data.originalImageUrl ||
            content.data.original_url
          );
        case "modified":
          return (
            content.data.modify_image_url ||
            content.data.modifyImageUrl ||
            content.data.modified_image_url ||
            content.data.modifiedImageUrl
          );
        case "difference":
          return (
            content.data.merged_mask_url ||
            content.data.merged_mask_image_url ||
            content.data.mergedMaskUrl ||
            content.data.mergedMaskImageUrl ||
            content.data.difference_image_url
          );
        default:
          return null;
      }
    };

    const originalImageUrl = getImageUrl("original");
    const modifiedImageUrl = getImageUrl("modified");
    const differenceImageUrl = getImageUrl("difference");

    console.log("추출된 이미지 URLs:", {
      original: originalImageUrl,
      modified: modifiedImageUrl,
      difference: differenceImageUrl,
    });

    return (
      <div key={content.id} className="content-card">
        <div className="content-thumbnail">
          <div className="image-trio">
            <div
              className="image-container original"
              onMouseEnter={() => handleImageHover(content.id, "original")}
              onMouseLeave={handleImageLeave}
            >
              <div className="image-placeholder">
                {originalImageUrl ? (
                  <img
                    src={originalImageUrl}
                    alt="원본 이미지"
                    onClick={() => handleImageClick(originalImageUrl, "원본")}
                    style={{ cursor: "pointer" }}
                    onError={(e) => {
                      console.error("원본 이미지 로드 실패:", originalImageUrl);
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div style={{ textAlign: "center", color: "#666" }}>
                    🏠
                    <br />
                    <small>원본 이미지 없음</small>
                  </div>
                )}
              </div>
              <span className="image-label">원본</span>

              {/* 원본 이미지 호버 시 오른쪽에 확대 */}
              {isHovered && hoveredType === "original" && originalImageUrl && (
                <div className="hover-preview right show">
                  <img src={originalImageUrl} alt="원본 이미지 확대" />
                  <div className="hover-preview-label">원본 이미지</div>
                </div>
              )}
            </div>

            <div
              className="image-container modified"
              onMouseEnter={() => handleImageHover(content.id, "modified")}
              onMouseLeave={handleImageLeave}
            >
              <div className="image-placeholder">
                {modifiedImageUrl ? (
                  <img
                    src={modifiedImageUrl}
                    alt="변경된 이미지"
                    onClick={() => handleImageClick(modifiedImageUrl, "변경")}
                    style={{ cursor: "pointer" }}
                    onError={(e) => {
                      console.error(
                        "변경된 이미지 로드 실패:",
                        modifiedImageUrl
                      );
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div style={{ textAlign: "center", color: "#666" }}>
                    🏡
                    <br />
                    <small>변경된 이미지 없음</small>
                  </div>
                )}
              </div>
              <span className="image-label">변경</span>

              {/* 중간 이미지는 왼쪽과 오른쪽 모두 가능 - 여기서는 오른쪽으로 */}
              {isHovered && hoveredType === "modified" && modifiedImageUrl && (
                <div className="hover-preview right show">
                  <img src={modifiedImageUrl} alt="변경된 이미지 확대" />
                  <div className="hover-preview-label">변경된 이미지</div>
                </div>
              )}
            </div>

            <div
              className="image-container difference"
              onMouseEnter={() => handleImageHover(content.id, "difference")}
              onMouseLeave={handleImageLeave}
            >
              <div className="image-placeholder">
                {differenceImageUrl ? (
                  <img
                    src={differenceImageUrl}
                    alt="차이점 이미지"
                    onClick={() =>
                      handleImageClick(differenceImageUrl, "차이점")
                    }
                    style={{ cursor: "pointer" }}
                    onError={(e) => {
                      console.error(
                        "차이점 이미지 로드 실패:",
                        differenceImageUrl
                      );
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div style={{ textAlign: "center", color: "#666" }}>
                    🔍
                    <br />
                    <small>차이점 이미지 없음</small>
                  </div>
                )}
              </div>
              <span className="image-label">차이점</span>

              {/* 차이점 이미지 호버 시 왼쪽에 확대 */}
              {isHovered &&
                hoveredType === "difference" &&
                differenceImageUrl && (
                  <div className="hover-preview left show">
                    <img src={differenceImageUrl} alt="차이점 이미지 확대" />
                    <div className="hover-preview-label">차이점 표시</div>
                  </div>
                )}
            </div>
          </div>
        </div>
        <h3>{content.title}</h3>
        <p>{content.description}</p>
        <div className="content-actions">
          {contentStage === "PENDING" && (
            <>
              <button
                className="action-btn approve"
                onClick={() => handleApprove(content.id)}
              >
                ✅ 승인
              </button>
              <button
                className="action-btn reject"
                onClick={() => handleReject(content.id)}
              >
                ❌ 거절
              </button>
            </>
          )}
          {contentStage === "APPROVED" && (
            <>
              <button
                className="action-btn reject"
                onClick={() => handleReject(content.id)}
              >
                ❌ 거절로 이동
              </button>
              <button
                className="action-btn pending"
                onClick={() => handleReset(content.id)}
              >
                ⏳ 대기로 이동
              </button>
            </>
          )}
          {contentStage === "REJECTED" && (
            <>
              <button
                className="action-btn approve"
                onClick={() => handleApprove(content.id)}
              >
                ✅ 승인으로 이동
              </button>
              <button
                className="action-btn pending"
                onClick={() => handleReset(content.id)}
              >
                ⏳ 대기로 이동
              </button>
              <button
                className="action-btn delete"
                onClick={() => handleDelete(content.id)}
              >
                🗑️ 삭제
              </button>
            </>
          )}
          {contentStage === "UPLOADED" && (
            <div className="uploaded-message">
              <span className="uploaded-icon">🚀</span>
              <span>업로드 완료된 컨텐츠입니다</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="tteul-find-show">
      <div className="content-header">
        <div className="header-title-row">
          <h2>
            {channel.icon} {channel.name} 컨텐츠
          </h2>
          {channel.charge !== undefined &&
            channel.charge !== null &&
            channel.charge > 0 && (
              <div className="project-cost">
                <span className="cost-label">현재 비용</span>
                <span className="cost-amount">
                  $ {channel.charge.toLocaleString()}
                </span>
              </div>
            )}
        </div>
        <p>이 채널의 컨텐츠를 관리하고 체리피킹할 수 있습니다.</p>
      </div>

      {/* 단계별 탭 */}
      <div className="stage-tabs">
        {Object.entries(stageConfig).map(([key, config]) => (
          <button
            key={key}
            className={`stage-tab ${contentStage === key ? "active" : ""}`}
            onClick={() => setContentStage(key)}
            style={{ "--tab-color": config.color }}
          >
            <span className="stage-icon">{config.icon}</span>
            <span className="stage-title">{config.title}</span>
            <span className="content-count">
              ({contents.filter((c) => c.status === key).length})
            </span>
          </button>
        ))}
      </div>

      {/* 현재 단계 정보 */}
      <div className="stage-info">
        <h3>
          {stageConfig[contentStage].icon} {stageConfig[contentStage].title}
        </h3>
        <p>{stageConfig[contentStage].description}</p>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner">⏳</div>
          <p>컨텐츠를 불러오는 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="error-state">
          <div className="error-icon">❌</div>
          <p>컨텐츠를 불러오는 중 오류가 발생했습니다: {error}</p>
        </div>
      )}

      {/* 컨텐츠 그리드 / 캐러셀 */}
      {!loading && !error && filteredContents.length > 0 ? (
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
                        className={`indicator ${
                          index === currentSlide ? "active" : ""
                        }`}
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
        !loading &&
        !error && (
          <div className="empty-state">
            <div className="empty-icon">{stageConfig[contentStage].icon}</div>
            <h3>아직 {stageConfig[contentStage].title}가 없습니다</h3>
            <p>컨텐츠가 이 단계로 이동하면 여기에 표시됩니다.</p>
          </div>
        )
      )}

      {/* 이미지 모달 */}
      {modalImage && (
        <div className="image-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>
            <div className="modal-image-container">
              <img
                src={modalImage.url}
                alt={`${modalImage.type} 이미지`}
                onLoad={(e) => {
                  console.log("이미지 로드 완료:", {
                    naturalWidth: e.target.naturalWidth,
                    naturalHeight: e.target.naturalHeight,
                    displayWidth: e.target.width,
                    displayHeight: e.target.height,
                  });
                }}
                onError={(e) => {
                  console.error("모달 이미지 로드 실패:", modalImage.url);
                }}
              />
            </div>
            <div className="modal-info">
              <h3>{modalImage.type} 이미지</h3>
              <p>이미지를 확대해서 보고 있습니다</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TteulFindShow;
