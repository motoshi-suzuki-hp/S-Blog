import React from "react";
import "./Header.css";

const Footer = () => {
    return (
        <header>
            <div className="header-inner">
                <div className="header-logo">
                    <a href="https://sakurazaka46.com/s/s46/?ima=0000">
                        <img src="/com-logo_pc.svg" alt="logo" />
                    </a>
                </div>
                <div className="header-nav">
                    <ul>
                        <li><a href="https://sakurazaka46.com/s/s46/news/list">NEWS</a></li>
                        <li className="pc"><a href="https://sakurazaka46.com/s/s46/media/list">SCHEDULE</a></li>
                        
                        {/* <li><a href="https://sakurazaka46.com/s/s46/search/artist">MEMBER</a></li> */}
                        <li><a href="/member">MEMBER</a></li>
                        <li><a href="https://sakurazaka46.com/s/s46/page/formation">FORMATION</a></li>
                        {/* <li><a href="https://sakurazaka46.com/s/s46/diary/blog/list">BLOG</a></li> */}
                        <li><a href="/">BLOG</a></li>
                        <li><a href="https://sakurazaka46.com/s/s46/artist/00/discography">DISCOGRAPHY</a></li>
                        <li><a href="https://sakurazaka46.com/s/s46/diary/tv2">TV</a></li>
                        <li><a href="https://sakurazaka46.com/s/s46/diary/event_page/list">MEET&amp;GREET</a></li>
                        <li><a href="https://sakurazaka46.com/s/s46/contents_list">VIDEO</a></li>
                        <li><a href="https://sakurazaka46.com/s/s46/diary/live_page/list">LIVE</a></li>
                        <li><a href="https://store.plusmember.jp/sakurazaka46/" target="_blank" rel="noreferrer">GOODS</a></li>
                        <li><a href="https://sakurazaka46.com/s/s46/page/about_fanclub">FANCLUB</a></li>
                        <li><a href="https://sakurazaka46.com/s/s46/item/list">FC GOODS</a></li>
                    </ul>
                </div>
            </div>
        </header>
        
    );
};

export default Footer;