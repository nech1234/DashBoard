import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import TteulFindShow from "./components/TteulFindShow";
import { supabase } from "./lib/supabase";
import "./App.css";

const MainContent = () => {
  return (
    <div className="welcome-area">
      <div className="welcome-content">
        <h2>🎯 대시보드에 오신 것을 환영합니다!</h2>
        <p>왼쪽 햄버거 메뉴를 클릭하여 관리할 채널을 선택해주세요.</p>
        <div className="welcome-features">
          <div className="feature-item">
            <span className="feature-icon">📺</span>
            <h3>채널 관리</h3>
            <p>여러 유튜브 채널을 한 곳에서 관리하세요</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎬</span>
            <h3>컨텐츠 체리피킹</h3>
            <p>업로드 전 컨텐츠를 미리 검토하고 승인하세요</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🚀</span>
            <h3>자동화 도구</h3>
            <p>효율적인 컨텐츠 관리와 업로드 자동화</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const navigate = useNavigate();

  // 초기 렌더링 시 모든 테이블 데이터 콘솔에 출력
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        console.log("=== 🚀 초기 데이터 로딩 시작 ===");

        // 환경 변수 확인
        console.log("🔧 환경 변수 상태:");
        console.log(
          `  - VITE_SUPABASE_URL: ${
            import.meta.env.VITE_SUPABASE_URL ? "✅ 설정됨" : "❌ 설정 안됨"
          }`
        );
        console.log(
          `  - VITE_SUPABASE_ANON_KEY: ${
            import.meta.env.VITE_SUPABASE_ANON_KEY
              ? "✅ 설정됨"
              : "❌ 설정 안됨"
          }`
        );

        if (
          !import.meta.env.VITE_SUPABASE_URL ||
          !import.meta.env.VITE_SUPABASE_ANON_KEY
        ) {
          console.warn(
            "⚠️  환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요."
          );
          console.log(
            "💡 .env 파일에서 SUPABASE_URL → VITE_SUPABASE_URL, SUPABASE_ANON_KEY → VITE_SUPABASE_ANON_KEY로 변경하세요."
          );
          return;
        }

        // 프로젝트 데이터 가져오기
        const { data: projects, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (projectsError) {
          console.error("❌ 프로젝트 데이터 로딩 실패:", projectsError);
        } else {
          console.log("📺 프로젝트 데이터:", projects);
        }

        // JSON 아이템 데이터 가져오기
        const { data: jsonItems, error: jsonItemsError } = await supabase
          .from("json_items")
          .select("*")
          .order("created_at", { ascending: false });

        if (jsonItemsError) {
          console.error("❌ JSON 아이템 데이터 로딩 실패:", jsonItemsError);
        } else {
          console.log("🎬 JSON 아이템 데이터:", jsonItems);
        }

        // 테이블 통계 정보
        console.log("📊 데이터 통계:");
        console.log(`  - 총 프로젝트 수: ${projects ? projects.length : 0}`);
        console.log(
          `  - 총 JSON 아이템 수: ${jsonItems ? jsonItems.length : 0}`
        );

        if (jsonItems && jsonItems.length > 0) {
          const statusCounts = jsonItems.reduce((acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
          }, {});
          console.log("  - 상태별 JSON 아이템 수:", statusCounts);
        }

        console.log("=== ✅ 초기 데이터 로딩 완료 ===");
      } catch (error) {
        console.error("❌ 데이터 로딩 중 오류:", error);
      }
    };

    fetchAllData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    // 채널 선택 시 해당 채널 페이지로 이동
    // 모든 채널에 대해 동일한 컴포넌트를 사용하지만 다른 데이터를 전달
    navigate(`/channel/${channel.id}`);
  };

  const handleLogoClick = () => {
    setSelectedChannel(null);
    navigate("/");
  };

  return (
    <div className="app">
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        setIsSidebarOpen={setIsSidebarOpen}
        selectedChannel={selectedChannel}
        onChannelSelect={handleChannelSelect}
        onLogoClick={handleLogoClick}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route
            path="/channel/:channelId"
            element={
              selectedChannel ? (
                <TteulFindShow channel={selectedChannel} />
              ) : (
                <div className="no-channel-selected">
                  <p>채널을 선택해주세요.</p>
                </div>
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
