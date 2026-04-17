
"use client"
import { useMutation } from '@tanstack/react-query'
import { changePassword } from '../app/apis-actions/change_password/change_password'
import Loading from './loading'
import toast from 'react-hot-toast'
import { changePasswordSchema } from '../schema/changePasword.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

type changePassword = {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = {
        strength: '',
        color: '',
        bars: 0,
        requirements: {
            length: false,
            number: false,
            uppercase: false,
            symbol: false
        }
    };

    if (!password) {
        return { ...feedback, strength: '', color: 'gray', bars: 0 };
    }


    if (password.length >= 6) {
        feedback.requirements.length = true;
        score++;
    }
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    if (/\d/.test(password)) {
        feedback.requirements.number = true;
        score++;
    }

    if (/[A-Z]/.test(password)) {
        feedback.requirements.uppercase = true;
        score++;
    }


    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        feedback.requirements.symbol = true;
        score++;
    }


    if (score <= 2) {
        feedback.strength = 'Weak';
        feedback.color = 'red';
        feedback.bars = 1;
    } else if (score <= 4) {
        feedback.strength = 'Fair';
        feedback.color = 'orange';
        feedback.bars = 2;
    } else if (score <= 6) {
        feedback.strength = 'Good';
        feedback.color = 'yellow';
        feedback.bars = 3;
    } else {
        feedback.strength = 'Strong';
        feedback.color = 'green';
        feedback.bars = 4;
    }

    return feedback;
};

export default function Change_Password({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {

    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });





    const togglePassword = (field: keyof typeof showPassword) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleClose = () => {
        setShowPassword({
            oldPassword: false,
            newPassword: false,
            confirmPassword: false
        });

        form.reset({
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        });
        onClose();
    };

    const form = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            confirmNewPassword: "",
            newPassword: "",
        }
    })

    const newPassword = form.watch('newPassword');
    const passwordStrength = checkPasswordStrength(newPassword || '');

    const { isPending: isChangePasswordLoading, mutate } = useMutation({
        mutationFn: ({ currentPassword, newPassword }: { currentPassword: string, newPassword: string }) => changePassword(currentPassword, newPassword),
        onSuccess: () => {
            toast.success("Password changed successfully")
            onClose()
        },
        onError: () => {
            toast.error("Failed to change password")
        }
    })

    function onSubmit(data: changePassword) {
        mutate({
            currentPassword: data.oldPassword,
            newPassword: data.newPassword,
        });
    }

    if (isChangePasswordLoading) {
        return <Loading />
    }
    return <>

        {isOpen && (
            <>
                <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">

                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Change Password
                            </h2>
                            <button
                                className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                                onClick={handleClose}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-5">
                            {/* Current Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword.oldPassword ? "text" : "password"}
                                        className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="Enter your current password"
                                        {...form.register("oldPassword")}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        onClick={() => togglePassword('oldPassword')}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {!showPassword.oldPassword ? (
                                                <>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </>
                                            ) : (
                                                <>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </>
                                            )}
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-100" />

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword.newPassword ? "text" : "password"}
                                        className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="Enter a new password"
                                        {...form.register("newPassword")}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        onClick={() => togglePassword('newPassword')}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {!showPassword.newPassword ? (
                                                <>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </>
                                            ) : (
                                                <>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </>
                                            )}
                                        </svg>
                                    </button>
                                </div>

                                <div>
                                    {/* Dynamic Strength Bars */}
                                    {newPassword && (
                                        <>
                                            <div className="mt-2.5 flex gap-1.5">
                                                {[1, 2, 3, 4].map((bar) => (
                                                    <div
                                                        key={bar}
                                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${bar <= passwordStrength.bars
                                                            ? passwordStrength.color === 'red'
                                                                ? 'bg-red-400'
                                                                : passwordStrength.color === 'orange'
                                                                    ? 'bg-orange-400'
                                                                    : passwordStrength.color === 'yellow'
                                                                        ? 'bg-yellow-400'
                                                                        : 'bg-green-400'
                                                            : 'bg-gray-200'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className={`text-xs mt-1.5 ${passwordStrength.color === 'red'
                                                ? 'text-red-600'
                                                : passwordStrength.color === 'orange'
                                                    ? 'text-orange-600'
                                                    : passwordStrength.color === 'yellow'
                                                        ? 'text-yellow-600'
                                                        : 'text-green-600'
                                                }`}>
                                                {passwordStrength.strength}
                                            </p>
                                        </>
                                    )}

                                    {/* Requirements */}
                                    <div className="mt-3 grid grid-cols-2 gap-y-1.5 gap-x-3">
                                        <div className={`flex items-center gap-1.5 text-xs ${passwordStrength.requirements.length ? 'text-green-600' : 'text-gray-400'}`}>
                                            {passwordStrength.requirements.length ? (
                                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                                                </svg>
                                            )}
                                            6+ characters
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-xs ${passwordStrength.requirements.number ? 'text-green-600' : 'text-gray-400'}`}>
                                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                                            </svg>
                                            A number
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-xs ${passwordStrength.requirements.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Uppercase letter
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-xs ${passwordStrength.requirements.symbol ? 'text-green-600' : 'text-gray-400'}`}>
                                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                                            </svg>
                                            A symbol
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword.confirmPassword ? "text" : "password"}
                                        className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="Re-enter your new password"
                                        {...form.register("confirmNewPassword")}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        onClick={() => togglePassword('confirmPassword')}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {!showPassword.confirmPassword ? (
                                                <>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </>
                                            ) : (
                                                <>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </>
                                            )}
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-1">
                                <button
                                    type="submit"
                                    className="flex-1 cursor-pointer py-3 bg-gray-50 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 cursor-pointer py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </>
        )}
    </>
}
