import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Helmet } from "react-helmet";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";
import { checkPageAccessAndRedirect } from "../utils/SpotifyAuthService";
import {
    fetchAdminOverview,
    fetchMonthlyActiveUsers,
    fetchCreatedUsers,
    fetchRecentShuffles,
    fetchRecentFailures,
    fetchFailureRate,
    createErrorFromResponse,
} from "../features/admin/services/AdminApiService";
import StatCard from "../features/admin/components/StatCard";
import MonthlyActiveUsersChart from "../features/admin/components/MonthlyActiveUsersChart";
import CreatedUsersTable from "../features/admin/components/CreatedUsersTable";
import RecentShufflesTable from "../features/admin/components/RecentShufflesTable";
import RecentFailuresTable from "../features/admin/components/RecentFailuresTable";
import FailureRateChart from "../features/admin/components/FailureRateChart";

const CREATED_USERS_EXPAND_STEP = 6;
const CREATED_USERS_MAX_MONTHS = 120;

const AdminPage = ({ loginUri }) => {
    const [auth, setAuth] = useState(
        document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth'))
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isForbidden, setIsForbidden] = useState(false);
    const [overview, setOverview] = useState(null);
    const [monthlyActiveUsers, setMonthlyActiveUsers] = useState([]);
    const [createdUsers, setCreatedUsers] = useState([]);
    const [createdUsersMonths, setCreatedUsersMonths] = useState(6);
    const [recentShuffles, setRecentShuffles] = useState([]);
    const [recentFailures, setRecentFailures] = useState([]);
    const [failureRate, setFailureRate] = useState([]);

    const handleRequestError = useCallback((error) => {
        const status = error && error.response && error.response.status;
        if (status === 401) {
            // Session is invalid or expired - send user through the login flow
            setAuth(false);
        } else if (status === 403) {
            setIsForbidden(true);
        } else {
            setError(createErrorFromResponse(error));
        }
    }, []);

    const loadCreatedUsers = useCallback(async (months) => {
        try {
            const response = await fetchCreatedUsers(months);
            setCreatedUsers(response.data.created_users_monthly || []);
            setCreatedUsersMonths(months);
        } catch (responseError) {
            handleRequestError(responseError);
        }
    }, [handleRequestError]);

    const loadAdminData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setIsForbidden(false);
        try {
            const [
                overviewResponse,
                monthlyResponse,
                createdResponse,
                recentResponse,
                failuresResponse,
                rateResponse,
            ] = await Promise.all([
                fetchAdminOverview(),
                fetchMonthlyActiveUsers(),
                fetchCreatedUsers(6),
                fetchRecentShuffles(20),
                fetchRecentFailures(20),
                fetchFailureRate("month"),
            ]);
            setOverview(overviewResponse.data);
            setMonthlyActiveUsers(monthlyResponse.data.monthly_active_users || []);
            setCreatedUsers(createdResponse.data.created_users_monthly || []);
            setRecentShuffles(recentResponse.data.recent_shuffles || []);
            setRecentFailures(failuresResponse.data.recent_failures || []);
            setFailureRate(rateResponse.data.failure_rate || []);
        } catch (responseError) {
            handleRequestError(responseError);
        } finally {
            setIsLoading(false);
        }
    }, [handleRequestError]);

    useEffect(() => {
        if (auth === true) {
            loadAdminData();
        }
    }, [auth, loadAdminData]);

    const handleShowMoreMonths = () => {
        const nextMonths = Math.min(createdUsersMonths + CREATED_USERS_EXPAND_STEP, CREATED_USERS_MAX_MONTHS);
        loadCreatedUsers(nextMonths);
    };

    const formatDuration = (seconds) => {
        if (seconds == null || isNaN(seconds)) return "-";
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m`;
    };

    const formatPercentage = (rate) => {
        if (rate == null || isNaN(rate)) return "-";
        return `${(rate * 100).toFixed(1)}%`;
    };

    if (auth === false) {
        return checkPageAccessAndRedirect(auth, loginUri, "/admin");
    }

    return (
        <Box sx={{ width: "90%", margin: "auto", paddingBottom: "40px" }}>
            <Helmet>
                <title>Admin | True Shuffle for Spotify</title>
                <meta name="description" content="True Shuffle admin dashboard" />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <Typography variant='h2' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                Admin Dashboard
            </Typography>

            {isForbidden && (
                <Box className="loading-container">
                    <Typography variant='h4' component="div" sx={{ color: "white" }}>
                        Access Denied
                    </Typography>
                    <Typography variant='body1' component="div" sx={{ color: "lightgrey", paddingTop: "10px" }}>
                        Your account does not have admin access to this dashboard.
                    </Typography>
                </Box>
            )}

            {error !== null && <ErrorMessage error={error} isGeneric={false} />}

            {isLoading && !error && !isForbidden && <LoadingMessage />}

            {!isLoading && !error && !isForbidden && overview !== null && (
                <>
                    {/* Overview stat cards */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", marginTop: 2 }}>
                        <Box sx={{ flex: "1 1 180px", minWidth: "150px", maxWidth: "220px" }}>
                            <StatCard title="Total Users" value={overview.total_users} description="Users who have logged in with Spotify" />
                        </Box>
                        <Box sx={{ flex: "1 1 180px", minWidth: "150px", maxWidth: "220px" }}>
                            <StatCard title="Playlists Shuffled" value={overview.total_playlists_shuffled} description="Total shuffled playlists created" />
                        </Box>
                        <Box sx={{ flex: "1 1 180px", minWidth: "150px", maxWidth: "220px" }}>
                            <StatCard title="Tracks Shuffled" value={overview.total_tracks_shuffled} description="Total tracks added to shuffled playlists" />
                        </Box>
                        <Box sx={{ flex: "1 1 180px", minWidth: "150px", maxWidth: "220px" }}>
                            <StatCard title="Active Sessions" value={overview.active_sessions} description="Users with a valid session right now" />
                        </Box>
                        <Box sx={{ flex: "1 1 180px", minWidth: "150px", maxWidth: "220px" }}>
                            <StatCard title="Avg Tracks / Shuffle" value={overview.avg_tracks_per_shuffle} description="Average number of tracks per successful shuffle" />
                        </Box>
                        <Box sx={{ flex: "1 1 180px", minWidth: "150px", maxWidth: "220px" }}>
                            <StatCard title="Avg Shuffle Duration" value={formatDuration(overview.avg_shuffle_duration_seconds)} description="Average time taken to complete a successful shuffle" />
                        </Box>
                        <Box sx={{ flex: "1 1 180px", minWidth: "150px", maxWidth: "220px" }}>
                            <StatCard title="Failure Rate" value={formatPercentage(overview.overall_failure_rate)} description="Share of all shuffle attempts that failed" />
                        </Box>
                    </Box>

                    {/* Monthly active users */}
                    <Box sx={{ marginTop: 4 }}>
                        <Typography variant='h5' component="div" sx={{ color: "white", marginBottom: 1 }}>
                            Monthly Active Users
                        </Typography>
                        <Paper elevation={0} sx={{ bgcolor: "#181818", borderRadius: "5px", p: 2 }}>
                            <MonthlyActiveUsersChart data={monthlyActiveUsers} />
                        </Paper>
                    </Box>

                    {/* New users per month */}
                    <Box sx={{ marginTop: 4 }}>
                        <Typography variant='h5' component="div" sx={{ color: "white", marginBottom: 1 }}>
                            New Users Per Month
                        </Typography>
                        <CreatedUsersTable
                            data={createdUsers}
                            canExpand={createdUsersMonths < CREATED_USERS_MAX_MONTHS}
                            onShowMore={handleShowMoreMonths}
                        />
                    </Box>

                    {/* Recent shuffles */}
                    <Box sx={{ marginTop: 4 }}>
                        <Typography variant='h5' component="div" sx={{ color: "white", marginBottom: 1 }}>
                            Recent Shuffles
                        </Typography>
                        <RecentShufflesTable shuffles={recentShuffles} />
                    </Box>

                    {/* Recent failures */}
                    <Box sx={{ marginTop: 4 }}>
                        <Typography variant='h5' component="div" sx={{ color: "white", marginBottom: 1 }}>
                            Recent Failures
                        </Typography>
                        <RecentFailuresTable failures={recentFailures} />
                    </Box>

                    {/* Failure rate over time */}
                    <Box sx={{ marginTop: 4 }}>
                        <Typography variant='h5' component="div" sx={{ color: "white", marginBottom: 1 }}>
                            Failure Rate Over Time
                        </Typography>
                        <Paper elevation={0} sx={{ bgcolor: "#181818", borderRadius: "5px", p: 2 }}>
                            <FailureRateChart data={failureRate} />
                        </Paper>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default AdminPage;
