import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState<'welcome' | 'upload' | 'processing' | 'success'>('welcome');
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];

            if (validTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
                setError(null);
            } else {
                setError('Please upload a PDF or Word document (.docx, .doc)');
                setFile(null);
            }
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsLoading(true);
        setStep('processing');
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Assuming AGW is at localhost:8080
            await axios.post('http://localhost:8080/api/v1/cv/ingest', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true // For JWT from cookie if BFF, or we might need to add Auth header
            });
            setStep('success');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to process CV. Please try again or fill manually.');
            setStep('upload');
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants: import('framer-motion').Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="bg-background border border-border rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl"
                    >
                        {/* Modal Header Progress */}
                        <div className="h-1 w-full bg-surface-highlight">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: '25%' }}
                                animate={{
                                    width: step === 'welcome' ? '25%' : step === 'upload' ? '50%' : step === 'processing' ? '75%' : '100%'
                                }}
                            />
                        </div>

                        <div className="p-8 lg:p-10">
                            {step === 'welcome' && (
                                <div className="text-center">
                                    <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                        <span className="material-symbols-outlined text-primary text-3xl">magic_button</span>
                                    </div>
                                    <h2 className="text-3xl font-serif text-primary mb-4">Welcome to Profolio AI</h2>
                                    <p className="text-text-muted mb-8 leading-relaxed">
                                        Build your conversational portfolio in seconds. We can automatically create your AI persona by analyzing your CV/Resume.
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => setStep('upload')}
                                            className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-medium shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-lg">upload_file</span>
                                            Quick Setup with CV
                                        </button>
                                        <button
                                            onClick={onComplete}
                                            className="w-full bg-transparent text-text-muted py-3 rounded-xl font-medium hover:text-primary transition-all text-sm"
                                        >
                                            I'll set it up manually
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 'upload' && (
                                <div>
                                    <h2 className="text-2xl font-serif text-primary mb-2">Upload your CV</h2>
                                    <p className="text-sm text-text-muted mb-8">Supported formats: PDF, DOCX, DOC (Max 10MB)</p>

                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-surface'
                                            }`}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept=".pdf,.docx,.doc"
                                            onChange={handleFileChange}
                                        />
                                        <span className={`material-symbols-outlined text-4xl mb-4 ${file ? 'text-primary' : 'text-text-muted'}`}>
                                            {file ? 'description' : 'cloud_upload'}
                                        </span>
                                        <p className="font-medium text-primary mb-1">
                                            {file ? file.name : 'Click or drag to upload'}
                                        </p>
                                        <p className="text-xs text-text-muted">
                                            {file ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : 'Your data is secured'}
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                                            {error}
                                        </div>
                                    )}

                                    <div className="mt-8 flex gap-4">
                                        <button
                                            onClick={() => setStep('welcome')}
                                            className="flex-1 px-6 py-3 border border-border rounded-xl text-text-muted hover:text-primary transition-all font-medium text-sm"
                                        >
                                            Back
                                        </button>
                                        <button
                                            disabled={!file || isLoading}
                                            onClick={handleUpload}
                                            className="flex-[2] bg-primary text-primary-foreground py-3 rounded-xl font-medium shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            {isLoading ? 'Processing...' : 'Analyze CV'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 'processing' && (
                                <div className="text-center py-10">
                                    <div className="flex justify-center mb-8">
                                        <div className="relative">
                                            <div className="size-20 rounded-full border-4 border-border border-t-primary animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-2xl animate-pulse">psychology</span>
                                            </div>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-serif text-primary mb-3">AI is analyzing...</h2>
                                    <p className="text-text-muted max-w-sm mx-auto">
                                        We're extracting your professional experience, skills, and personality traits to build your digital twin.
                                    </p>
                                </div>
                            )}

                            {step === 'success' && (
                                <div className="text-center py-4">
                                    <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                                        <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
                                    </div>
                                    <h2 className="text-3xl font-serif text-primary mb-4">Magic happened!</h2>
                                    <p className="text-text-muted mb-8">
                                        Your CV has been analyzed. We've pre-filled your profile and tuned your AI personality.
                                    </p>
                                    <button
                                        onClick={onComplete}
                                        className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium shadow-lg hover:opacity-90 transition-all"
                                    >
                                        Go to Dashboard
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default OnboardingModal;
