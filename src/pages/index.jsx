import React, { useState } from 'react';
import Button from '@mui/material/Button';
import LoginModal from '@/components/LoginModal';
import {playClickSound} from '@/utils/sound'
const styles = {
    root: {
        background: 'linear-gradient(90deg, rgb(26, 42, 62) 0%, rgb(11, 20, 30) 100%)',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        margin: '8px',
    },
};
export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenModal = () => {
        playClickSound();
        setIsModalOpen(true);
    };


    return (
        <div style={styles.root}>
            <Button
                variant="contained"
                color="primary"
                style={styles.button}
                onClick={handleOpenModal}
            >
                GO
            </Button>
            <LoginModal open={isModalOpen} onClose={handleCloseModal}/>
        </div>
    );
}

