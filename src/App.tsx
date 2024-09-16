import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthorList from './pages/AuthorList';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import Header from './pages/Header';
import Footer from './pages/Footer';
import MemberProfile from './pages/MemberProfile';
import MemberList from './pages/MemberList';

const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<AuthorList />} />
                <Route path="/member/" element={<MemberList />} />
                <Route path="/profile/:authorId/" element={<MemberProfile />} />
                <Route path="/author/:authorId/blogs" element={<BlogList />} />
                <Route path="/author/:authorId/blog/:blogId" element={<BlogDetail />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
