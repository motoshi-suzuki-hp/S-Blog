import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// import Calendar from './Calendar';
import './BlogDetail.css';
import './PageHeader.css';


interface Blog {
    id: number;
    title: string;
    content: string;
    date: string;
}

type Profile = {
    from: string;
    birthday: string;
  };
  

const BlogDetail: React.FC = () => {
    const { blogId } = useParams<{ blogId: string }>();
    const { authorId } = useParams<{ authorId: string }>();
    const [authorName, setAuthorName] = useState<string>("");
    const [authorFurigana, setAuthorFurigana] = useState<string>("");
    const [authorRomaji, setAuthorRomaji] = useState<string>("");
    const [profile, setProfile] = useState<Profile>({ from: "", birthday: "" });
    const [blog, setBlog] = useState<Blog | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchBlog = async () => {
            try {
                const response = await fetch(`http://localhost:8080/author/${authorId}/blog/${blogId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBlog(data.blog);
                setAuthorName(data.name); // 作者名を保存
                setAuthorFurigana(data.furigana); // 作者名を保存
                setAuthorRomaji(data.romaji); // 作者名を保存
                setProfile(data.profile);
            } catch (error) {
                setError(`Error fetching blog: ${error}`);
            }
        };

        fetchBlog();
    }, [authorId, blogId]);

    

    if (!blog) {
        return <div>Loading...</div>;
    }

    return (
        <div className="blog-detail">
            <div className="blog-detail-inner">
                <div className="page-header">
                    <div className="page-header-title">
                        <h1>OFFICIAL BLOG</h1>
                    </div>
                    
                    <p>{authorName} 公式ブログ</p>
                </div>


                <div className='blog-detail-elements'>
                    <div className="blog-detail-left">
                        <div className="blog-detail-date col-l">
                            <div className="blog-detail-date-inner">
                                <div className="year-month">
                                    <p>{splitDateToYMD(blog.date)[0]}</p>
                                    <p>{splitDateToYMD(blog.date)[1]}</p>
                                </div>
                                <div className="date">
                                    <p>{splitDateToYMD(blog.date)[2]}</p>
                                </div>
                                
                            </div>
                        </div>
                        <div className='blog-detail-title col-r'>
                            <div className="blog-detail-title-inner">
                                <p>{blog.title}</p>
                            </div>
                        </div>
                        <div className='blog-detail-name col-l'>
                            <div className="blog-detail-name-inner">
                                <p>{authorRomaji}</p>
                            </div>
                        </div>
                        {/* Reactは`dangerouslySetInnerHTML`を使用してHTML文字列を安全に挿入します */}
                        <div className="blog-detail-body col-r">
                            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                            <div className="blog-detail-body-foot">
                                <div>
                                    <p className="blog-detail-body-foot-name">{authorName}</p>
                                    <p className="blog-detail-body-foot-date">{blog.date}</p>
                                </div>
                            </div>
                        </div>

                        
                    </div>

                    <div className="blog-right">
                        <div className="blog-profile">
                        <div className="blog-profile-inner">
                            <div className="blog-profile-image">
                            <img src={`/profileImage/${authorId}.jpg`} alt="" />
                            </div>
                            <h2>{authorName}</h2>
                            <h3>{authorFurigana}</h3>
                            <p>{profile.from}出身</p>
                            <p>{convertBirthdayToFormat(profile.birthday)}生</p>
                        </div>
                        <div className="blog-profile-detail">
                            <Link to={`/profile/${authorId}`}>
                                <p>詳細プロフィール</p>
                            </Link>
                        </div>
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

function splitDateToYMD(date: string): string[] {
    var ymd = date.split(' ')[0];
    return [ymd.split('.')[0], ymd.split('.')[1], ymd.split('.')[2]];
}
export default BlogDetail;
