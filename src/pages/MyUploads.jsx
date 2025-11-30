import React, { useState, useEffect } from 'react';
import { getUserPapers } from '../services/firestore';
import { useAuth } from '../contexts/AuthContext';
import PaperCard from '../components/PaperCard';
import { Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyUploads = () => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {
        fetchMyPapers();
    }, [currentUser]);

    const fetchMyPapers = async () => {
        if (!currentUser) return;

        try {
            setLoading(true);
            const userPapers = await getUserPapers(currentUser.uid);
            setPapers(userPapers);
        } catch (err) {
            setError('Failed to fetch your papers. ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Callback to refresh papers after delete
    const handlePaperDeleted = () => {
        fetchMyPapers();
    };

    return (
        <div className="home-page">
            <section className="hero-section">
                <h1 className="hero-title">My Uploads</h1>
                <p className="hero-subtitle">Manage your uploaded question papers</p>
            </section>

            <main className="main-content" style={{ display: 'block', maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: '#6b7280' }}>Loading your papers...</p>
                    </div>
                ) : error ? (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#b91c1c',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        {error}
                    </div>
                ) : papers.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        border: '2px dashed #e5e7eb'
                    }}>
                        <Upload size={48} style={{ color: '#9ca3af', margin: '0 auto 1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                            No papers uploaded yet
                        </h3>
                        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                            Start sharing your question papers with the community
                        </p>
                        <Link to="/upload" className="btn btn-primary">
                            Upload Your First Paper
                        </Link>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {papers.map(paper => (
                            <PaperCard
                                key={paper.id}
                                paper={paper}
                                showActions={true}
                                onDeleted={handlePaperDeleted}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyUploads;
