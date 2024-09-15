import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MemberList.css';
import './PageHeader.css';


interface Author {
    id: number;
    name: string;
    furigana: string;
    generation: number;
}

const MemberList: React.FC = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchMembers = async () => {
            try {
                const response = await fetch(`http://localhost:8080/member/`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAuthors(data); // 作者名を保存
            } catch (error) {
                setError(`Error fetching blog: ${error}`);
            }
        };

        fetchMembers();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }


    return (
        <div className="member-list">
            <div className="member-list-inner">
                <div className="page-header">
                    <div className="page-header-title">
                        <h1>MEMBER</h1>
                    </div>
                    <p>卒業生</p>
                </div>

                <div className="member-list-content">
                    <div className="member-list-content-inner">
                        {generationOrder(authors).map((authorsList) => (
                            <div className='member-list-content-groups'>
                                <div className="member-list-content-groups-title">
                                    <p>櫻坂46<br />{convertNumberToKanji(authorsList[0]?.generation)}期生</p>
                                </div>
                                <div className="member-list-content-groups-list">
                                    {authorsList.map((author) => (
                                        <Link to={`/profile/${author.id}`} key={author.id}>
                                            <div className="member-list-item">
                                                <div className="member-list-item-inner">
                                                    <div className="member-list-item-image">
                                                        <img src={`/profileImage/${author.id}.jpg`} alt={author.name} />
                                                    </div>
                                                    <div className="member-list-item-name">
                                                        <p>{author.name}</p>
                                                        <p>{author.furigana}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


function generationOrder(authors: Author[]): Author[][] {
    const authors1st = authors.filter(author => author.generation === 1);
    const authors2nd = authors.filter(author => author.generation === 2);
    const authors_GenerationOrder: Author[][] = [authors1st, authors2nd];
    return authors_GenerationOrder;
}

function convertNumberToKanji(number: number): string {
    var convertedNumber = ''
    if (number === 1) {
        convertedNumber = '一';
    } else if (number === 2) {
        convertedNumber = '二';
    }
    return convertedNumber;
}

export default MemberList;