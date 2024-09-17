import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MemberProfile.css';
import './PageHeader.css';


type Profile = {
    birthday: string
    zodiac: string
    height: string
    from: string
    blood: string
};



const MemberProfile: React.FC = () => {
    const { authorId } = useParams<{ authorId: string }>();
    const [authorName, setAuthorName] = useState<string>("");
    const [authorFurigana, setAuthorFurigana] = useState<string>("");
    const [authorRomaji, setAuthorRomaji] = useState<string>("");
    const [profile, setProfile] = useState<Profile>({ birthday: "", zodiac: "", height: "", from: "", blood: "", });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchBlog = async () => {
            try {
                const response = await fetch(`https://s-blog-backend.onrender.com/profile/${authorId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAuthorName(data.name); // 作者名を保存
                setAuthorFurigana(data.furigana); // 作者名を保存
                setAuthorRomaji(data.romaji); // 作者名を保存
                setProfile(data.profile);

                console.log(data);
            } catch (error) {
                setError(`Error fetching blog: ${error}`);
            }
        };

        fetchBlog();
    }, [authorId]);

    
    return (
        <div className="profile">
            <div className="profile-inner">
                <div className="page-header">
                    <div className="page-header-title">
                        <h1>MEMBER</h1>
                    </div>
                    <p>{authorName}</p>
                </div>

                <div className='profile-elements'>
                    <div className="profile-col-l">
                        <div className="profile-text">
                            <p className="name">{authorName}</p>
                            <p className="furigana">{authorFurigana}</p>
                            <table className="profile-table">
                                <tr>
                                    <td>生年月日</td>
                                    <td>{convertBirthdayToFormat(profile.birthday)}</td>
                                </tr>
                                <tr>
                                    <td>星座</td>
                                    <td>{profile.zodiac}</td>
                                </tr>
                                <tr>
                                    <td>身長</td>
                                    <td>{profile.height}</td>
                                </tr>
                                <tr>
                                    <td>出身地</td>
                                    <td>{profile.from}</td>
                                </tr>
                                <tr>
                                    <td>血液型</td>
                                    <td>{profile.blood}</td>
                                </tr>
                            </table>
                        </div>

                        <div className='romaji'>
                            <p>{authorRomaji}</p>
                        </div>

                    </div>

                    <div className="profile-col-c">
                        <div className="profile-image">
                            <img src={`/profileImage/${authorId}.jpg`} alt="" />
                        </div>
                    </div>

                    <div className="profile-col-r">
                        <div className="greeting-title">
                            <h2>GREETING</h2>
                            <p>{authorName}のグリーティングカード</p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

function convertBirthdayToFormat(birthday: string): string {
    return birthday.split('.')[0] + '年' + birthday.split('.')[1] + '月' + birthday.split('.')[2] + '日';
}

export default MemberProfile;
