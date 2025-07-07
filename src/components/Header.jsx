import React, { useEffect } from "react";
import "./Header.css";

const Header = ({ isSidebarOpen, toggleSidebar, setIsSidebarOpen, selectedChannel, onChannelSelect, onLogoClick }) => {
  const channels = [
    { id: 1, name: "틀찾쇼", icon: "🎯" },
    // 추가 채널들은 나중에 여기에 추가할 수 있습니다
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      const sidebar = document.getElementById("sidebar");
      const menuBtn = document.getElementById("menuButton");
      if (
        sidebar &&
        !sidebar.contains(e.target) &&
        menuBtn &&
        !menuBtn.contains(e.target)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSidebarOpen]);

  const handleChannelClick = (channel) => {
    onChannelSelect(channel);
    setIsSidebarOpen(false); // 채널 선택 후 사이드바 닫기
  };

  const handleDashboardClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
    setIsSidebarOpen(false); // Dashboard 클릭 시 사이드바 닫기
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-area">
          <button
            id="menuButton"
            className="icon-button"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <span className="logo-icon">📺</span>
          <button 
            className="logo-button"
            onClick={handleDashboardClick}
          >
            <h1 className="logo-text">Dashboard</h1>
          </button>
        </div>
        <div className="channel-info">
          {selectedChannel && (
            <span className="selected-channel">
              {selectedChannel.icon} {selectedChannel.name}
            </span>
          )}
        </div>
      </div>
      <aside
        id="sidebar"
        className={isSidebarOpen ? "sidebar open" : "sidebar"}
      >
        <div className="sidebar-header">
          <h2>채널 관리</h2>
          <button
            className="icon-button"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav>
          {channels.map((channel) => (
            <button
              key={channel.id}
              className={`channel-item ${selectedChannel?.id === channel.id ? 'active' : ''}`}
              onClick={() => handleChannelClick(channel)}
            >
              <span className="channel-icon">{channel.icon}</span>
              <span className="channel-name">{channel.name}</span>
            </button>
          ))}
          <button className="add-channel-btn">
            ➕ 새 채널 추가
          </button>
        </nav>
      </aside>
    </header>
  );
};

export default Header;
