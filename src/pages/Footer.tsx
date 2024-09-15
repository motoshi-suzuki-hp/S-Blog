import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer>
            <div className="footer-inner">
                <div className="footer-nav">
                    <ul>
                        <li>
                            <a href="">櫻坂46とは?</a>
                            </li>
                        <li>
                            <a href="">PRODUCER</a>
                        </li>
                        <li>
                            <a href="">FAQ</a>
                        </li>
                        <li>
                            <a href="">お問い合わせ</a>
                        </li>
                        <li>
                            <a href="">アーカイブ</a>
                        </li>
                        <li>
                            <a href="">欅坂46オフィシャルサイト</a>
                        </li>
                    </ul>
                </div>
                <div className="footer-jasrac">
                    <p className="txt">JASRAC許諾第6709411244Y45037号<br />JASRAC許諾第9018170002Y31018号</p>
                    <img src="/jasrac.jpg" alt="jasrac" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;