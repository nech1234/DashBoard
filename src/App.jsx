import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import TteulFindShow from "./components/TteulFindShow";
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    // 채널에 따라 다른 경로로 이동
    if (channel.name === "틀찾쇼") {
      navigate("/tteul-find-show");
    }
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
            path="/tteul-find-show" 
            element={
              <TteulFindShow 
                channel={{ id: 1, name: "틀찾쇼", icon: "🎯" }} 
              />
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
