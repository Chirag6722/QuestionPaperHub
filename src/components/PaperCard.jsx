import React, { useState } from 'react';
import { FileText, Download, School, BookOpen, Layers, ClipboardList, Loader, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { downloadBase64File } from '../utils/fileHelpers';
import { deletePaper } from '../services/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PaperCard = ({ paper, showActions = false, onDeleted }) => {
    const [downloading, setDownloading] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleDownload = async (base64Data, fileName, mimeType, index) => {
        if (downloading !== null) return;

        console.log('Download initiated:', { fileName, mimeType, dataLength: base64Data?.length });

        setDownloading(index);
        const success = await downloadBase64File(base64Data, fileName, mimeType);

        console.log('Download result:', success);

        if (!success) {
            alert('Download failed. Please try again.');
        }
        setDownloading(null);
    };

    const handleEdit = () => {
        navigate(`/upload?edit=${paper.id}`);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${paper.subject}"?\n\nThis action cannot be undone.`
        );

        if (!confirmDelete) return;

        try {
            setDeleting(true);
            await deletePaper(paper.id);
            alert('Paper deleted successfully!');
            if (onDeleted) {
                onDeleted();
            }
        } catch (error) {
            console.error('Error deleting paper:', error);
            alert('Failed to delete paper. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const isOwner = currentUser && paper.uploaderId === currentUser.uid;

    return (
        <div className="paper-card" style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        background: '#eff6ff',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        color: '#3b82f6'
                    }}>
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>{paper.subject}</h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Uploaded by {paper.uploaderName}</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={16} />
                    <span>{paper.course} - {paper.branch}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={16} />
                    <span>Semester {paper.semester}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ClipboardList size={16} />
                    <span>{paper.examType === 'IA1' ? 'IA 1' : paper.examType === 'IA2' ? 'IA 2' : paper.examType === 'IA3' ? 'IA 3' : paper.examType === 'SemEnd' ? 'Semester End' : paper.examType}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <School size={16} />
                    <span>{paper.college}</span>
                </div>
            </div>

            {showActions && isOwner && (
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #e5e7eb'
                }}>
                    <button
                        onClick={handleEdit}
                        disabled={deleting}
                        className="btn btn-outline"
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            opacity: deleting ? 0.5 : 1,
                            cursor: deleting ? 'not-allowed' : 'pointer'
                        }}
                    >
                        <Edit2 size={16} />
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #ef4444',
                            background: 'white',
                            color: '#ef4444',
                            fontWeight: '500',
                            cursor: deleting ? 'not-allowed' : 'pointer',
                            opacity: deleting ? 0.5 : 1,
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (!deleting) {
                                e.target.style.background = '#ef4444';
                                e.target.style.color = 'white';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.color = '#ef4444';
                        }}
                    >
                        {deleting ? <Loader className="spin" size={16} /> : <Trash2 size={16} />}
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            )}

            {paper.fileData && paper.fileData.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                            {paper.fileData.length} {paper.fileData.length === 1 ? 'File' : 'Files'} Available
                        </p>
                        {paper.fileData.length > 1 && (
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                {currentSlide + 1} / {paper.fileData.length}
                            </span>
                        )}
                    </div>

                    {/* Carousel Container */}
                    <div style={{ position: 'relative' }}>
                        {/* Slides */}
                        <div style={{
                            position: 'relative',
                            borderRadius: '0.375rem',
                            overflow: 'hidden',
                            border: '2px solid #e5e7eb',
                            background: '#f9fafb',
                            minHeight: '200px'
                        }}>
                            {paper.fileData.map((base64Data, index) => {
                                const fileType = paper.fileTypes?.[index] || '';
                                const fileName = paper.fileNames?.[index] || `file_${index + 1}`;
                                const isImage = fileType.includes('image') || fileType.includes('jpg') || fileType.includes('jpeg') || fileType.includes('png');

                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleDownload(base64Data, fileName, fileType, index)}
                                        style={{
                                            position: paper.fileData.length > 1 ? 'absolute' : 'relative',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            minHeight: '200px',
                                            cursor: downloading !== null ? 'not-allowed' : 'pointer',
                                            opacity: index === currentSlide ? 1 : 0,
                                            transform: index === currentSlide ? 'translateX(0)' : index < currentSlide ? 'translateX(-100%)' : 'translateX(100%)',
                                            transition: 'all 0.3s ease-in-out',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: isImage ? '#f9fafb' : '#eff6ff',
                                            pointerEvents: index === currentSlide ? 'auto' : 'none'
                                        }}
                                    >
                                        {isImage ? (
                                            <>
                                                <img
                                                    src={base64Data}
                                                    alt={fileName}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain',
                                                        maxHeight: '300px'
                                                    }}
                                                />
                                                {downloading === index && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        background: 'rgba(0,0,0,0.7)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white'
                                                    }}>
                                                        <Loader className="spin" size={24} />
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '2rem',
                                                textAlign: 'center'
                                            }}>
                                                {downloading === index ? (
                                                    <Loader className="spin" size={40} style={{ color: '#3b82f6' }} />
                                                ) : (
                                                    <FileText size={40} style={{ color: '#3b82f6' }} />
                                                )}
                                                <span style={{
                                                    fontSize: '0.875rem',
                                                    color: '#6b7280',
                                                    wordBreak: 'break-word'
                                                }}>
                                                    {downloading === index ? 'Downloading...' : fileName}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Navigation Arrows - Only show if more than 1 file */}
                        {paper.fileData.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentSlide((prev) => (prev === 0 ? paper.fileData.length - 1 : prev - 1));
                                    }}
                                    style={{
                                        position: 'absolute',
                                        left: '0.5rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'rgba(255,255,255,0.9)',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        zIndex: 10
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <ChevronLeft size={20} style={{ color: '#111827' }} />
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentSlide((prev) => (prev === paper.fileData.length - 1 ? 0 : prev + 1));
                                    }}
                                    style={{
                                        position: 'absolute',
                                        right: '0.5rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'rgba(255,255,255,0.9)',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        zIndex: 10
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <ChevronRight size={20} style={{ color: '#111827' }} />
                                </button>
                            </>
                        )}

                        {/* Dot Indicators - Only show if more than 1 file */}
                        {paper.fileData.length > 1 && (
                            <div style={{
                                position: 'absolute',
                                bottom: '0.75rem',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                gap: '0.375rem',
                                zIndex: 10
                            }}>
                                {paper.fileData.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentSlide(index);
                                        }}
                                        style={{
                                            width: index === currentSlide ? '24px' : '8px',
                                            height: '8px',
                                            borderRadius: '4px',
                                            background: index === currentSlide ? '#3b82f6' : 'rgba(255,255,255,0.7)',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            padding: 0
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            <style>{`
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PaperCard;
