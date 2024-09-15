import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BlogList.css';
import './AuthorList.css';
import './PageHeader.css';

interface Blog {
    id: number;
    title: string;
    content: string;
    date: string;
    thumbnail: string;
}

interface Author {
    id: number;
    name: string;
    furigana: string;
    graduationId: number;
    blogs: Blog[];
}


const AuthorList: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchAuthors = async () => {
            try {
                const response = await fetch('https://s-blog-backend.onrender.com/authors'); // Goサーバーから著者データを取得
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAuthors(data);
            } catch (error) {
                setError(`Error fetching authors: ${error}`);
            }
        };

        fetchAuthors();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }



    // authors.sort((a, b) => (a.furigana > b.furigana) ? 1 : ((b.furigana > a.furigana) ? -1 : 0));


    return (
        <div className='author'>
            <div className="author-inner">
                <div className="page-header">
                    <div className="page-header-title">
                        <h1>OFFICIAL BLOG</h1>
                    </div>
                    
                    <p>櫻坂46 公式ブログ 一覧</p>
                </div>


                <div className="graduation-blog-lists">
                    {authors.map((author) => (
                        <div key={author.id} className="graduation-blog-post">
                            <Link to={`/author/${author.id}/blog/${author.graduationId}`}>
                                <div className="graduation-blog-image">
                                    <img src={author.blogs[author.graduationId]?.thumbnail} alt="" />
                                </div>
                                <div className="graduation-blog-text">
                                    <small>{extractYMDFromDate(author.blogs[author.graduationId]?.date)}</small>
                                    <h3 className="text-limit">{author.blogs[author.graduationId]?.title}</h3>
                                    <p className="text-limit">{extractTextFromHTML(author.blogs[author.graduationId]?.content)}</p>
                                </div>
                                <div className="graduation-blog-more">
                                    <p>MORE</p>
                                </div>
                                <div className="graduation-blog-post-member">
                                    <img src={`/profileImage/${author.id}.jpg`} alt="" />
                                    <p>{author.name}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>


                <ul className='author-list'>
                    {authors.map((author) => (
                        <li key={author.id}>
                            <Link to={`/author/${author.id}/blogs`}>
                                <img src={`/profileImage/${author.id}.jpg`} alt="" />
                                <h3>{author.name}</h3>
                                {/* <p>{author.id}</p> */}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


function extractTextFromHTML(html: string): string {
    // HTML タグを取り除いて、テキストのみを抽出
    const text = html.replace(/<[^>]*>/g, '');

    // エンティティのデコード (例: &lt; -> <)
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.documentElement.textContent || '';
}

function extractYMDFromDate(date: string): string {
    return date.split(' ')[0];
}

export default AuthorList;
