import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  uploadResume,
  getResume,
  startInterview,
} from '../../services/interviewService.js';
import INTERVIEW_ROLES from '../../constants/roles.js';
import DIFFICULTY_LEVELS from '../../constants/difficulty.js';
import {
  BsDisplay,
  BsServer,
  BsLightningFill,
  BsGraphUp,
  BsCloudFill,
  BsStarFill,
  BsStar,
  BsFileEarmarkArrowUp,
  BsCheckCircleFill,
} from 'react-icons/bs';
import { FaPython, FaReact, FaJava } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './index.css';

const ROLE_ICONS = {
  'frontend-developer': BsDisplay,
  'backend-developer': BsServer,
  'full-stack-developer': BsLightningFill,
  'data-analyst': BsGraphUp,
  'devops-engineer': BsCloudFill,
  'python-developer': FaPython,
  'react-developer': FaReact,
  'java-developer': FaJava,
};

const DIFFICULTY_ICONS = {
  easy: (
    <span className="setup-difficulty-stars">
      <BsStarFill className="setup-star-filled" />
      <BsStar className="setup-star-empty" />
      <BsStar className="setup-star-empty" />
    </span>
  ),
  medium: (
    <span className="setup-difficulty-stars">
      <BsStarFill className="setup-star-filled" />
      <BsStarFill className="setup-star-filled" />
      <BsStar className="setup-star-empty" />
    </span>
  ),
  hard: (
    <span className="setup-difficulty-stars">
      <BsStarFill className="setup-star-filled" />
      <BsStarFill className="setup-star-filled" />
      <BsStarFill className="setup-star-filled" />
    </span>
  ),
};

function InterviewSetupPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeId, setResumeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const handleNext = () => {
  setStep(step + 1);
};

 const handleBack = () => {
  setStep(step - 1);
};
const handleResumeUpload = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setUploadingResume(true);

  try {
    const response = await uploadResume(file);

    console.log("UPLOAD RESPONSE:", response);

    if (response?.text) {
      setResumeText(response.text);
      setResumeFileName(file.name);
    }

    if (response?.resumeId) {
      setResumeId(response.resumeId);
    }

    toast.success("Resume uploaded successfully");
  } catch (error) {
    console.error(error);
    toast.error("Resume upload failed");
  } finally {
    setUploadingResume(false);
  }
};
const handleStartInterview = async () => {
  try {
    setLoading(true);

    const response = await startInterview(
      selectedRole,
      resumeText,
      10
    );

    console.log(response);

    navigate('/interview');
  } catch (error) {
    console.error(error);
    toast.error('Failed to start interview');
  } finally {
    setLoading(false);
  }
};
 
useEffect(() => {
  const loadResume = async () => {
    try {
      const response = await getResume();

      if (response?.resumeText) {
        setResumeText(response.resumeText);
        setResumeFileName(response.fileName || 'resume.pdf');
      }
    } catch (error) {
      console.error('Failed to load resume:', error);
    }
  };

  loadResume();
}, []);
  if (loading) {
    return (
      <div className="setup-page">
        <div className="setup-preparing">
          <div className="spinner-border setup-preparing-spinner" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h2 className="setup-preparing-heading">
            Preparing Your Interview...
          </h2>
          <p className="setup-preparing-text">
            AI is analyzing your resume and generating personalized questions for
            the <strong>{selectedRole}</strong> role.
          </p>
          <div className="setup-preparing-steps">
            <div className="setup-prep-step">
              <BsCheckCircleFill className="setup-prep-step-icon-active" />
              <span className="setup-prep-step-text">Analyzing resume</span>
            </div>
            <div className="setup-prep-step">
              <BsCheckCircleFill className="setup-prep-step-icon-active" />
              <span className="setup-prep-step-text">
                Generating questions
              </span>
            </div>
            <div className="setup-prep-step">
              <BsCheckCircleFill className="setup-prep-step-icon-pending" />
              <span className="setup-prep-step-text">
                Setting up voice interviewer
              </span>
            </div>
          </div>
          <p className="setup-preparing-hint">
            This may take 10-15 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="setup-page">
      <div className="setup-container">
        <div className="setup-step-indicator">
          <span
            className={`setup-step-badge ${step >= 1 ? 'setup-step-active' : ''}`}
          >
            1. Role
          </span>
          <span
            className={`setup-step-badge ${step >= 2 ? 'setup-step-active' : ''}`}
          >
            2. Difficulty
          </span>
          <span
            className={`setup-step-badge ${step >= 3 ? 'setup-step-active' : ''}`}
          >
            3. Resume
          </span>
        </div>

        {step === 1 && (
          <div className="setup-section">
            <h2 className="setup-section-heading">Select Interview Role</h2>
            <div className="setup-roles-grid">
              {INTERVIEW_ROLES.map((role) => {
                const RoleIcon = ROLE_ICONS[role.id];
                return (
                  <button
                    key={role.id}
                    className={`setup-role-card ${selectedRole === role.title ? 'setup-role-selected' : ''}`}
                    onClick={() => setSelectedRole(role.title)}
                  >
                    {RoleIcon && <RoleIcon className="setup-role-icon" />}
                    <h3 className="setup-role-title">{role.title}</h3>
                    <p className="setup-role-desc">{role.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="setup-section">
            <h2 className="setup-section-heading">Choose Difficulty</h2>
            <div className="setup-difficulty-row">
              {DIFFICULTY_LEVELS.map((level) => (
                <button
                  key={level.id}
                  className={`setup-difficulty-card ${selectedDifficulty === level.id ? 'setup-difficulty-selected' : ''}`}
                  onClick={() => setSelectedDifficulty(level.id)}
                >
                  {DIFFICULTY_ICONS[level.id]}
                  <h3 className="setup-difficulty-label">{level.label}</h3>
                  <p className="setup-difficulty-desc">{level.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="setup-section">
            <h2 className="setup-section-heading">Upload Your Resume</h2>
            <div className="setup-resume-area">
              {resumeText ? (
                <div className="setup-resume-uploaded">
                  <div className="setup-resume-info">
                    <BsFileEarmarkArrowUp className="setup-resume-file-icon" />
                    <p className="setup-resume-name">{resumeFileName}</p>
                  </div>
                  <label className="setup-change-resume-btn">
                    Change
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      hidden
                    />
                  </label>
                </div>
              ) : (
                <label className="setup-upload-zone">
                  <BsFileEarmarkArrowUp className="setup-upload-icon" />
                  <p className="setup-upload-text">
                    {uploadingResume
                      ? 'Uploading...'
                      : 'Click to upload PDF resume'}
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    disabled={uploadingResume}
                    hidden
                  />
                </label>
              )}
            </div>
          </div>
        )}

        <div className="setup-nav-buttons">
          {step > 1 && (
            <button className="setup-back-btn" onClick={handleBack}>
              Back
            </button>
          )}
          {step < 3 ? (
            <button className="setup-next-btn" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button
              className={`setup-start-btn ${loading || !selectedRole || !resumeText ? 'setup-start-btn-disabled' : ''}`}
              onClick={handleStartInterview}
              disabled={loading || !selectedRole || !resumeText}
            >
              Start Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewSetupPage;
