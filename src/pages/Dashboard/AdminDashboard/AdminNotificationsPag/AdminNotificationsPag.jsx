import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Header from "../../../../Shared/Header";

const fetchAllNotifications = async (axiosPublic) => {
    const { data } = await axiosPublic.get(`/notifications/admin?role=admin`);
    return Array.isArray(data) ? data : [];
};

const AdminNotificationsPage = () => {
    const axiosPublic = useAxiosPublic();
    const queryClient = useQueryClient();

    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ["adminNotifications"],
        queryFn: () => fetchAllNotifications(axiosPublic),
    });

    const deleteNotification = async (id) => {
        try {
            await axiosPublic.delete(`/notifications/${id}`);
            queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
            Swal.fire("Deleted!", "Notification deleted successfully.", "success"); // ✅ alert
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    const deleteAllNotifications = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will delete all admin notifications!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete all!'
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosPublic.delete(`/notifications/admin/all`);
                if (res.data.deletedCount > 0) {
                    await Swal.fire('Deleted!', 'All admin notifications have been deleted.', 'success');
                    queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
                } else {
                    Swal.fire('No notifications!', 'There were no admin notifications to delete.', 'info');
                }
            } catch (error) {
                console.error("Failed to delete admin notifications:", error);
                Swal.fire('Error!', 'Failed to delete admin notifications.', 'error');
            }
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="md:p-6">
            <Header
                header={"Admin Notifications"}
                title={
                    "Stay updated with important alerts and system notifications to manage platform activities."
                }

            />
            <div className="w-full h-full p-5 bg-base-100 overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
                <div className="lg:w-[70%] sm:w-[80%] w-[90%] mx-auto flex flex-col gap-4 py-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-semibold">Admin Notifications</h2>
                        <button
                            onClick={deleteAllNotifications}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Delete All Notifications
                        </button>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`relative w-full flex flex-col gap-3 p-6 rounded-xl shadow-md transition-all ${notification.isRead
                                        ? "bg-gray-200 border-l-4 border-gray-400"
                                        : "bg-sky-50 border-l-4 border-sky-500"
                                        }`}
                                >
                                    {/* 🗑️ Delete Button */}
                                    <button
                                        onClick={() => deleteNotification(notification._id)}
                                        className="absolute top-4 right-4 text-sky-500 hover:text-sky-700"
                                        title="Delete notification"
                                    >
                                        <MdDelete />
                                    </button>

                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-xl font-bold text-blue-600 hover:underline cursor-pointer">
                                            {notification.name}
                                        </h3>
                                        <p className="text-gray-600">{notification.message}</p>
                                        <div className="text-sm text-gray-400 flex gap-2 flex-wrap">
                                            <span>#notification</span>
                                            <span>#update</span>
                                        </div>
                                    </div>

                                    <hr className="border-gray-200" />

                                    {/* Bottom section */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No notifications found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNotificationsPage;
