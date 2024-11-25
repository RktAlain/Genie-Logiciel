import React, { useState } from 'react';
import {
    Box,
    Avatar,
    Typography,
    TextField,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Badge,
    Paper,
} from '@mui/material';
import {
    Search,
    VideoCall,
    MoreVert,
    ChatBubbleOutline,
    Send,
    Info,
    Notifications,
    AttachFile,
    Logout, // Import de l'icône Logout
} from '@mui/icons-material';

export function Home() {
    const [activeDiscussion, setActiveDiscussion] = useState(0); // Ajout de l'état pour la discussion active

    const handleLogout = () => {
        // Logique de déconnexion, comme rediriger vers la page de connexion
        console.log('Déconnexion...');
    };

    // Liste des discussions et des messages associés
    const discussions = [
        { name: 'Ndilvah Moanazara (device 1)', messages: ['Ny Tatie anao mbola hanao soutenance rahampitso ee 😂😂', 'Ts6 eee!!!!'] },
        { name: 'Mpillongue\'y (device 2)', messages: ['Message de Mpillongue\'y 1', 'Message de Mpillongue\'y 2'] },
        { name: 'Promo raiky (device 3)', messages: ['Message de Promo raiky 1', 'Message de Promo raiky 2'] },
        { name: 'Ma tatie (device 4)', messages: ['Message de Ma tatie 1', 'Message de Ma tatie 2'] },
    ];

    const handleDiscussionClick = (index) => {
        setActiveDiscussion(index); // Mettre à jour l'état pour la discussion active
    };

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                backgroundColor: '#f0f2f5',
                overflow: 'hidden',
            }}
        >
            {/* Sidebar - Discussions */}
            <Box
                sx={{
                    width: { xs: '100%', md: '25%' },
                    backgroundColor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid #ddd',
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 2,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Discussions
                    </Typography>
                </Box>

                {/* Search Bar */}
                <Box sx={{ paddingX: 2, paddingBottom: 2 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Rechercher dans Messenger"
                        size="small"
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <IconButton>
                                    <Search />
                                </IconButton>
                            ),
                        }}
                    />
                </Box>

                {/* Contacts List */}
                <List
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                    }}
                >
                    {discussions.map((discussion, index) => (
                        <ListItem
                            key={index}
                            button
                            onClick={() => handleDiscussionClick(index)} // Change la discussion active
                            sx={{ paddingY: 1 }}
                        >
                            <ListItemAvatar>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    badgeContent={
                                        <Box
                                            sx={{
                                                backgroundColor: '#44b700',
                                                width: 10,
                                                height: 10,
                                                borderRadius: '50%',
                                            }}
                                        />
                                    }
                                >
                                    <Avatar
                                        alt={discussion.name}
                                        src={`https://i.pravatar.cc/150?img=${index + 1}`}
                                    />
                                </Badge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={discussion.name}
                                secondary={
                                    activeDiscussion === index ? discussion.messages[discussion.messages.length - 1] : 'Aucune nouvelle'
                                }
                                primaryTypographyProps={{ fontWeight: 'bold' }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Main Chat Section */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 2,
                        borderBottom: '1px solid #ddd',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            alt={discussions[activeDiscussion].name}
                            src={`https://i.pravatar.cc/150?img=${activeDiscussion + 1}`}
                        />
                        <Box sx={{ marginLeft: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {discussions[activeDiscussion].name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                En ligne il y a 1 h
                            </Typography>
                        </Box>
                    </Box>
                    <Box>
                        <IconButton>
                            <VideoCall />
                        </IconButton>
                        <IconButton>
                            <ChatBubbleOutline />
                        </IconButton>
                        <IconButton>
                            <MoreVert />
                        </IconButton>
                    </Box>
                </Paper>

                {/* Messages */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: 2,
                        backgroundColor: '#e4e6eb',
                    }}
                >
                    {discussions[activeDiscussion].messages.map((message, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                marginBottom: 2,
                                justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
                            }}
                        >
                            <Avatar
                                alt={discussions[activeDiscussion].name}
                                src={`https://i.pravatar.cc/150?img=${activeDiscussion + 1}`}
                                sx={{ marginRight: 1 }}
                            />
                            <Typography
                                sx={{
                                    backgroundColor: index % 2 === 0 ? '#fff' : '#d1e7dd',
                                    padding: 1.5,
                                    borderRadius: 2,
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                }}
                            >
                                {message}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Input Field */}
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 1,
                        borderTop: '1px solid #ddd',
                    }}
                >
                    {/* Icone Pièce Jointe */}
                    <IconButton color="primary">
                        <AttachFile />
                    </IconButton>

                    {/* Champ de saisie */}
                    <TextField
                        variant="outlined"
                        placeholder="Aa"
                        size="small"
                        fullWidth
                        sx={{ marginRight: 1 }}
                    />

                    {/* Bouton d'envoi */}
                    <IconButton color="primary">
                        <Send />
                    </IconButton>
                </Paper>
            </Box>

            {/* Right Sidebar */}
            <Box
                sx={{
                    width: '25%',
                    backgroundColor: '#fff',
                    borderLeft: '1px solid #ddd',
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    padding: 2,
                }}
            >
                <Avatar
                    alt={discussions[activeDiscussion].name}
                    src={`https://i.pravatar.cc/150?img=${activeDiscussion + 1}`}
                    sx={{ width: 100, height: 100, margin: '0 auto' }}
                />
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: 2 }}
                >
                    {discussions[activeDiscussion].name}
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                <List>
                    <ListItem button>
                        <ListItemText primary="Profil" />
                        <Info />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Notifications" />
                        <Notifications />
                    </ListItem>
                    {/* Bouton Déconnexion */}
                    <ListItem button onClick={handleLogout}>
                        <ListItemText primary="Déconnexion" />
                        <Logout />
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
}
