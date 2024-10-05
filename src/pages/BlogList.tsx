import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import "../reset.css";
import "./BlogList.css";
import './PageHeader.css';

type Blog = {
  id: number;
  title: string;
  date: string;
  content: string;
  thumbnail: string;
};

type Profile = {
  from: string;
  birthday: string;
};

const PAGE_SIZE = 12; // 1ページあたりのブログの数
const PAGE_COUNT_TO_SHOW = 6; // 表示するページ数

const BlogList = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [profile, setProfile] = useState<Profile>({ from: "", birthday: "" });
  const [authorName, setAuthorName] = useState<string>("");
  const [authorFurigana, setAuthorFurigana] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // const [currentPage, setCurrentPage] = useState<number>(1);
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBlogs = async () => {
      try {
        const response = await fetch(`https://s-blog-backend.onrender.com/blogs/${authorId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setAuthorName(data.name); // 作者名を保存
        setAuthorFurigana(data.furigana); // 作者名を保存
        setBlogs(data.blogs); // ブログリストを保存
        setProfile(data.profile);
      } catch (error) {
        setError(`Error fetching authors: ${error}`);
      }
    };

    fetchBlogs();
  }, [authorId]);

  if (error) {
    return <div>{error}</div>;
  }

  // ページネーションの計算
  const totalPages = Math.ceil(blogs.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedBlogs = blogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    // setCurrentPage(page);
    setSearchParams({ page: page.toString() });
    window.scrollTo(0, 0);
  };

  // ページ番号の表示範囲を計算
  const halfPageCount = Math.floor(PAGE_COUNT_TO_SHOW / 2);
  const endPage = Math.min(totalPages, currentPage + halfPageCount);

  // 上限が設定された場合、前ページの表示範囲を調整
  const adjustedStartPage = Math.max(1, endPage - PAGE_COUNT_TO_SHOW + 1);

  // ページネーションボタンのレンダリング
  const renderPagination = () => {
    const paginationButtons = [];

    // 最初のページボタン
    if (currentPage > 1) {
      paginationButtons.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className="pagination-button"
        >
          &laquo;
        </button>
      );
    }

    // 前のページボタン
    if (currentPage > 1) {
      paginationButtons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="pagination-button"
        >
          &lt;
        </button>
      );
    }

    // ページ番号ボタン
    if (adjustedStartPage > 1) {
      paginationButtons.push(
        <button
          key="dots-start"
          className="pagination-button disabled"
          disabled
        >
          ...
        </button>
      );
    }

    for (let page = adjustedStartPage; page <= endPage; page++) {
      paginationButtons.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`pagination-button ${
            currentPage === page ? "active" : ""
          }`}
        >
          {page}
        </button>
      );
    }

    if (endPage < totalPages) {
      paginationButtons.push(
        <button key="dots-end" className="pagination-button disabled" disabled>
          ...
        </button>
      );
    }

    // 次のページボタン
    if (currentPage < totalPages) {
      paginationButtons.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="pagination-button"
        >
          &gt;
        </button>
      );
    }

    // 最後のページボタン
    if (currentPage < totalPages) {
      paginationButtons.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className="pagination-button"
        >
          &raquo;
        </button>
      );
    }

    return <div className="pagination">{paginationButtons}</div>;
  };

  return (
    <div className="blog">
      <div className="blog-inner">
        <div className="page-header">
            <div className="page-header-title">
              <h1>OFFICIAL BLOG</h1>
            </div>
          <p>{authorName} 公式ブログ 一覧</p>
        </div>

        {/* メンバー一覧 */}
        <div className="blog-elements">
          <div className="blog-lists-outer">
            <h2>NEW POSTS</h2>
            <div className="blog-lists">
              {paginatedBlogs.map((blog) => (
                <div key={blog.id} className="blog-post">
                  <Link to={`/author/${authorId}/blog/${blog.id}`}>
                    <div className="blog-image">
                      <img src={blog.thumbnail} alt="" />
                    </div>
                    <div className="blog-text">
                      <small>{extractYMDFromDate(blog.date)}</small>
                      <h3 className="text-limit">{blog.title}</h3>
                      <p className="text-limit">{extractTextFromHTML(blog.content)}</p>
                    </div>
                    <div className="blog-more">
                      <p>MORE</p>
                    </div>
                    <div className="blog-post-member">
                      <img src={`/profileImage/${authorId}.jpg`} alt="" />
                      <p>{authorName}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="blog-list-nav">
              {renderPagination()}
              <div className="to-author-list">
                <Link to="/">櫻坂46のブログ一覧へ</Link>
              </div>
            </div>
            


          </div>
          <div className="blog-list-right">
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

function convertBirthdayToFormat(birthday: string): string {
  return birthday.split('.')[0] + '年' + birthday.split('.')[1] + '月' + birthday.split('.')[2] + '日生';
}

export default BlogList;
