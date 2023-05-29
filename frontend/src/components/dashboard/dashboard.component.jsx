import React, { useEffect, useState, useContext } from "react";
import './dashboard.css';
import { SnackbarContext } from '../../App';
import { getRequest } from "../../api-service";
import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Dashboard = () => {

    const [loader, setLoader] = useState(true);
    const [totalBooks, setTotalBooks] = useState(0);
    const [dashboardData, setDashboardData] = useState([]);
    const { snack, setSnack } = useContext(SnackbarContext);

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        (async () => {
            try {
                const response = await getRequest('/api/books/dashboard/');
                const data = response?.data;
                let tempTotalBooks = 0;
                Object.entries(data)?.map(([category, categoryData]) => {
                    tempTotalBooks += categoryData?.total;
                });
                setTotalBooks(tempTotalBooks);
                setDashboardData(data);
                setLoader(false);
                setSnack({ ...snack, message: 'Dashboard data Loaded!', open: true, severity: 'success' });
            } catch (error) {
                setLoader(false);
                setSnack({ ...snack, message: error?.response?.data?.error, open: true, severity: 'error' });
            };
        })();
    }, []);

    return (
        <div className="dashboard">
            <h1>Welcome to the Library</h1>
            {
                loader
                ? <CircularProgress />
                : <div className="dashboard-info">
                    <h2>Total Available Books: {totalBooks}</h2>
                    <div className="category-info">
                        <h2>Available Categories in Library</h2>
                        {
                            Object.entries(dashboardData)?.map(([category, categoryInfo]) => {
                                return <Accordion disabled={categoryInfo?.total === 0} key={category} expanded={expanded === category} onChange={handleChange(category)}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`${category}bh-content`}
                                        id={`${category}bh-header`}
                                    >
                                        <Typography sx={{ width: '40%', flexShrink: 0 }}>
                                            {categoryInfo?.categoryName}
                                        </Typography>
                                        <Typography>{categoryInfo?.total} {categoryInfo?.total >= 2 ? 'Books' : 'Book'}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div>
                                            {
                                                categoryInfo?.books?.map((book, index) => {
                                                    return <Typography key={category + index}>#{index + 1} {book}</Typography>
                                                })
                                            }
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            })
                        }
                    </div>
                </div>
            }
        </div>
    );
};

export default Dashboard;