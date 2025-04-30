import { confirmPasswordReset } from "firebase/auth";
import React, { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { auth } from "../../Firebase/firebase.config";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [errors, setErrors] = useState({ password: "", confirmPassword: "" });

    const oobCode = searchParams.get("oobCode"); // Get the oobCode from the URL

    // Function to generate a strong random password
    const generatePassword = () => {
        const length = 12;
        const charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&#";
        let generatedPassword = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            generatedPassword += charset[randomIndex];
        }
        setPassword(generatedPassword);
        setConfirmPassword(generatedPassword);
        setErrors({ password: "", confirmPassword: "" });
        Swal.fire({
            icon: "info",
            title: "Password Generated",
            text: `Your password has been auto-generated: ${generatedPassword}`,
        });
    };

    // Validate password strength
    const validatePassword = (password) => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!passwordRegex.test(password)) {
            return "Password must be at least 8 characters long and include an uppercase, lowercase, number, and special character.";
        }
        return "";
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Validate inputs
        const passwordError = validatePassword(password);
        const confirmPasswordError =
            password !== confirmPassword ? "Passwords do not match." : "";

        setErrors({ password: passwordError, confirmPassword: confirmPasswordError });

        if (passwordError || confirmPasswordError) {
            return;
        }

        try {
            setLoading(true);
            // Step 1: Reset the password in Firebase Auth
            await confirmPasswordReset(auth, oobCode, password);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Your password has been updated successfully!",
            });

            // Step 2: Update the password in your database
            const email = localStorage.getItem("resetUserEmail") || "fakeuser@example.com"; // Use fake email if none is stored
            if (email) {
                const response = await fetch("https://gizmorent-server.vercel.app/update-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, newPassword: password }),
                });

                if (response.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "Database Updated",
                        text: "Your password has been successfully updated in our system.",
                    });
                } else {
                    throw new Error("Failed to update password in the database.");
                }
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-t from-[#ffd166] to-gray-200 h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Reset Your Password</h2>
                <form onSubmit={handleResetPassword}>
                    <div className="mb-4 relative">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            New Password
                        </label>
                        <input
                            type={isVisible ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${errors.password ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Enter your new password"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setIsVisible((prev) => !prev)}
                            className="absolute inset-y-11 right-1 outline-none flex items-center justify-center w-9 text-muted-foreground/80 hover:text-foreground"
                        >
                            {isVisible ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                        </button>
                        {errors.password && (
                            <span className="pl-1 text-red-600">{errors.password}</span>
                        )}
                    </div>
                    <div className="mb-4 relative">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm New Password
                        </label>
                        <input
                            type={isVisible ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Confirm your new password"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setIsVisible((prev) => !prev)}
                            className="absolute inset-y-11 right-1 outline-none flex items-center justify-center w-9 text-muted-foreground/80 hover:text-foreground"
                        >
                            {isVisible ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                        </button>
                        {errors.confirmPassword && (
                            <span className="pl-1 text-red-600">{errors.confirmPassword}</span>
                        )}
                    </div>
                    <div className="flex justify-between mb-4">
                        <button
                            type="button"
                            onClick={generatePassword}
                            className="btn bg-gray-200 hover:bg-gray-300 text-black rounded-lg"
                            disabled={loading}
                        >
                            Generate Password
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="btn w-full rounded-lg hover:bg-Primary bg-Primary text-white"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;