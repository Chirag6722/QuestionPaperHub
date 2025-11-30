import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { filesToBase64 } from '../services/storage';
import { addPaper, getPaperById, updatePaper } from '../services/firestore';

const UploadPaper = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editPaperId = searchParams.get('edit');

    const [files, setFiles] = useState([]);
    const [subject, setSubject] = useState('');
    const [college, setCollege] = useState('');
    const [course, setCourse] = useState('');
    const [branch, setBranch] = useState('');
    const [semester, setSemester] = useState('');
    const [examType, setExamType] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const [existingPaper, setExistingPaper] = useState(null);

    // Load existing paper data if in edit mode
    useEffect(() => {
        const loadPaper = async () => {
            if (editPaperId) {
                try {
                    setLoading(true);
                    const paper = await getPaperById(editPaperId);

                    if (!paper) {
                        setError('Paper not found');
                        return;
                    }

                    // Check if user owns this paper
                    if (paper.uploaderId !== currentUser.uid) {
                        setError('You do not have permission to edit this paper');
                        return;
                    }

                    // Populate form with existing data
                    setExistingPaper(paper);
                    setSubject(paper.subject || '');
                    setCollege(paper.college || '');
                    setCourse(paper.course || '');
                    setBranch(paper.branch || '');
                    setSemester(paper.semester?.toString() || '');
                    setExamType(paper.examType || '');
                } catch (err) {
                    setError('Failed to load paper: ' + err.message);
                    console.error('Load error:', err);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadPaper();
    }, [editPaperId, currentUser]);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // For edit mode, files are optional (keep existing files if not changed)
        if (!editPaperId && files.length === 0) {
            return setError('Please select at least one file');
        }

        try {
            setError('');
            setLoading(true);
            setUploadProgress(0);

            let paperData = {
                subject,
                college,
                course,
                branch,
                semester: parseInt(semester),
                examType
            };

            // If new files are selected, convert them to base64
            if (files.length > 0) {
                setUploadProgress(10);
                const base64Files = await filesToBase64(files);
                setUploadProgress(50);

                paperData = {
                    ...paperData,
                    fileData: base64Files,
                    fileNames: files.map(f => f.name),
                    fileName: files[0].name,
                    fileTypes: files.map(f => f.type),
                    fileType: files[0].type
                };
            }

            if (editPaperId) {
                // Update existing paper
                await updatePaper(editPaperId, paperData);
                setUploadProgress(100);
                navigate('/my-uploads');
            } else {
                // Create new paper
                await addPaper({
                    ...paperData,
                    uploaderId: currentUser.uid,
                    uploaderName: currentUser.displayName || 'Anonymous'
                });
                setUploadProgress(100);
                navigate('/');
            }
        } catch (err) {
            setError(`Failed to ${editPaperId ? 'update' : 'upload'} paper: ` + err.message);
            console.error('Submit error:', err);
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '600px' }}>
                <h2 className="auth-title">{editPaperId ? 'Edit Question Paper' : 'Upload Question Paper'}</h2>
                <p className="auth-subtitle">{editPaperId ? 'Update your paper details' : 'Share your knowledge with others'}</p>

                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Course</label>
                        <select
                            className="form-input"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            required
                        >
                            <option value="">Select Course</option>
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
                        <label className="form-label">Branch/Department</label>
                        <select
                            className="form-input"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            required
                        >
                            <option value="">Select Branch</option>
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
                            required
                        >
                            <option value="">Select Semester</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                <option key={sem} value={sem}>Semester {sem}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Subject</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Mathematics, Physics"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Exam Type</label>
                        <select
                            className="form-input"
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                            required
                        >
                            <option value="">Select Exam Type</option>
                            <option value="IA1">Internal Assessment 1 (IA1)</option>
                            <option value="IA2">Internal Assessment 2 (IA2)</option>
                            <option value="IA3">Internal Assessment 3 (IA3)</option>
                            <option value="SemEnd">Semester End Exam</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">College/University</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. MIT, Stanford"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Files (PDF, JPG, PNG) - Multiple allowed
                            {editPaperId && <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '0.5rem' }}>(Leave empty to keep existing files)</span>}
                        </label>
                        <input
                            type="file"
                            accept=".pdf, .jpg, .jpeg, .png"
                            className="form-input"
                            onChange={handleFileChange}
                            multiple
                            required={!editPaperId}
                        />
                        {files.length > 0 && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                    Selected files ({files.length}):
                                </p>
                                {files.map((file, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.5rem',
                                        backgroundColor: '#f3f4f6',
                                        borderRadius: '0.25rem',
                                        marginBottom: '0.25rem'
                                    }}>
                                        <span style={{ fontSize: '0.875rem' }}>{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            style={{
                                                background: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '0.25rem',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {loading && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            backgroundColor: '#eff6ff',
                            borderRadius: '0.5rem',
                            border: '1px solid #3b82f6'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem'
                            }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e40af' }}>
                                    Uploading files...
                                </span>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e40af' }}>
                                    {uploadProgress}%
                                </span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '8px',
                                backgroundColor: '#dbeafe',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${uploadProgress}%`,
                                    height: '100%',
                                    backgroundColor: '#3b82f6',
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? `${editPaperId ? 'Updating' : 'Uploading'}... ${uploadProgress}%` : editPaperId ? 'Update Paper' : 'Upload Paper'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadPaper;
