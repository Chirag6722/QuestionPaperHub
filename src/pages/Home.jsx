import React, { useState, useEffect } from 'react';
import { getPapers } from '../services/firestore';
import PaperCard from '../components/PaperCard';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter States
    const [course, setCourse] = useState('');
    const [branch, setBranch] = useState('');
    const [semester, setSemester] = useState('');
    const [examType, setExamType] = useState('');

    useEffect(() => {
        fetchPapers();
    }, []); // Fetch all papers once on mount

    const fetchPapers = async () => {
        try {
            setLoading(true);
            // Fetch all papers without server-side filters
            const fetchedPapers = await getPapers();
            setPapers(fetchedPapers);
        } catch (err) {
            setError('Failed to fetch papers. ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Client-side filtering for both search and filters
    const filteredPapers = papers.filter(paper => {
        // Search filter
        const matchesSearch = !searchQuery ||
            paper.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.college?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (paper.fileNames && paper.fileNames.some(name =>
                name?.toLowerCase().includes(searchQuery.toLowerCase())
            ));

        // Course filter
        const matchesCourse = !course || paper.course === course;

        // Branch filter
        const matchesBranch = !branch || paper.branch === branch;

        // Semester filter
        const matchesSemester = !semester || paper.semester === parseInt(semester);

        // Exam type filter
        const matchesExamType = !examType || paper.examType === examType;

        return matchesSearch && matchesCourse && matchesBranch && matchesSemester && matchesExamType;
    });

    return (
        <div className="home-page">
            <section className="hero-section">
                <h1 className="hero-title">Question Paper Hub</h1>
                <p className="hero-subtitle">Share and discover past question papers from your college</p>

                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by subject, college, or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="search-btn" onClick={fetchPapers}>Search</button>
                </div>
            </section>

            <main className="main-content">
                <aside className="filters-sidebar">
                    <h3>Filters</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        Narrow down your search
                    </p>

                    <div className="form-group">
                        <label className="form-label">Course</label>
                        <select
                            className="form-input"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                        >
                            <option value="">All Courses</option>
                            <option value="B.Tech">B.Tech</option>
                            <option value="M.Tech">M.Tech</option>
                            <option value="B.Sc">B.Sc</option>
                            <option value="M.Sc">M.Sc</option>
                            <option value="MBA">MBA</option>
                            <option value="BCA">BCA</option>
                            <option value="MCA">MCA</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Branch</label>
                        <select
                            className="form-input"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                        >
                            <option value="">All Branches</option>
                            <option value="ISE">Information Science (ISE)</option>
                            <option value="CSE">Computer Science (CSE)</option>
                            <option value="CSAI">CS - Artificial Intelligence (CSAI)</option>
                            <option value="AIML">AI & Machine Learning (AIML)</option>
                            <option value="ECE">Electronics (ECE)</option>
                            <option value="EE">Electrical (EE)</option>
                            <option value="ME">Mechanical (ME)</option>
                            <option value="CE">Civil (CE)</option>
                            <option value="CSDesign">CS - Design (CSDesign)</option>
                            <option value="CSDataScience">CS - Data Science (CSDataScience)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Semester</label>
                        <select
                            className="form-input"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                        >
                            <option value="">All Semesters</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                <option key={sem} value={sem}>Semester {sem}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Exam Type</label>
                        <select
                            className="form-input"
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                        >
                            <option value="">All Exam Types</option>
                            <option value="IA1">Internal Assessment 1 (IA1)</option>
                            <option value="IA2">Internal Assessment 2 (IA2)</option>
                            <option value="IA3">Internal Assessment 3 (IA3)</option>
                            <option value="SemEnd">Semester End Exam</option>
                        </select>
                    </div>

                    <button
                        className="btn btn-outline"
                        style={{ width: '100%', marginTop: '1rem' }}
                        onClick={() => {
                            setCourse('');
                            setBranch('');
                            setSemester('');
                            setExamType('');
                        }}
                    >
                        Clear Filters
                    </button>
                </aside>

                <section className="papers-grid">
                    {loading ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Loading papers...</div>
                    ) : error ? (
                        <div className="empty-state">
                            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
                                {error}
                            </div>
                        </div>
                    ) : filteredPapers.length === 0 ? (
                        <div className="empty-state">
                            <p style={{ color: '#6b7280' }}>No papers found. Try adjusting your filters or search query.</p>
                        </div>
                    ) : (
                        filteredPapers.map(paper => (
                            <PaperCard key={paper.id} paper={paper} />
                        ))
                    )}
                </section>
            </main>
        </div>
    );
};

export default Home;
