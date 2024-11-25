import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Avatar,
    Typography,
    TextField,
    IconButton,
    Divider,
    Dialog,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Badge,
    Button,
    Paper,
} from '@mui/material';
import {
    Search,
    VideoCall,
    MoreVert,
    ChatBubbleOutline,
    Send,
    Close,
    Info,
    Notifications,
    AttachFile,
    Logout,
} from '@mui/icons-material';
import Peer from 'peerjs';

export function Home() {
    const [peer, setPeer] = useState(null);
    const [conn, setConn] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Créez une instance PeerJS pour se connecter au serveur PeerJS
        const peerInstance = new Peer({
            host: 'localhost',
            port: 3001, // Port du serveur PeerJS
            path: '/peerjs',
        });        

        peerInstance.on('open', (id) => {
            console.log('PeerJS ID:', id);
            setPeer(peerInstance);
        });

        peerInstance.on('connection', (connection) => {
            console.log('Nouvelle connexion Peer:', connection);
            setConn(connection);

            // Recevoir des messages via la connexion
            connection.on('data', (data) => {
                console.log('Message reçu via PeerJS:', data);
                setMessages((prevMessages) => [...prevMessages, data]);
            });
        });

        return () => {
            // Fermer la connexion PeerJS à la fin
            if (peer) {
                peer.destroy();
            }
        };
    }, []);

    const sendMessage = (message) => {
        if (conn) {
            conn.send(message);
            setMessages((prevMessages) => [...prevMessages, message]);
        }
    };
    
    const [activeDiscussion, setActiveDiscussion] = useState(0);
    const fileInputRef = useRef(null); // Référence pour l'input de fichier
    const [selectedFile, setSelectedFile] = useState(null);
    const [discussions, setDiscussions] = useState([
        { name: 'Ndilvah Moanazara (device 1)', messages: ['Ny Tatie anao mbola hanao soutenance rahampitso ee 😂😂', 'Ts6 eee!!!!'] },
        { name: 'Mpillongue\'y (device 2)', messages: ['Message de Mpillongue\'y 1', 'Message de Mpillongue\'y 2'] },
        { name: 'Promo raiky (device 3)', messages: ['Message de Promo raiky 1', 'Message de Promo raiky 2'] },
        { name: 'Ma tatie (device 4)', messages: ['Message de Ma tatie 1', 'Message de Ma tatie 2'] },
    ]);
    const [message, setMessage] = useState(''); // Message dans le champ de saisie

    const ws = useRef(null); // Référence pour la connexion WebSocket

    useEffect(() => {
        // Initialiser WebSocket
        ws.current = new WebSocket('ws://localhost:3000'); // URL du serveur WebSocket
        console.log('Connecting to WebSocket...');

        // Réception de messages
        ws.current.onmessage = (event) => {
            const receivedMessage = JSON.parse(event.data);
            const { discussionIndex, message, file } = receivedMessage;

            setDiscussions((prevDiscussions) => {
                const updatedDiscussions = [...prevDiscussions];
                if (file) {
                    // Ajouter un lien pour le fichier reçu
                    updatedDiscussions[discussionIndex].messages.push(
                        <a href={file.content} download={file.name}>
                            📎 {file.name}
                        </a>
                    );
                } else {
                    updatedDiscussions[discussionIndex].messages.push(message);
                }
                return updatedDiscussions;
            });
        };


        // Fermeture WebSocket
        ws.current.onclose = () => console.log('WebSocket disconnected');

        return () => {
            ws.current.close(); // Nettoyage à la désactivation du composant
        };
    }, []);

    const handleLogout = () => {
        console.log('Déconnexion...');
    };

    const handleDiscussionClick = (index) => {
        setActiveDiscussion(index);
    };

    const handleSendMessage = () => {
        if (message.trim() === '' && !selectedFile) return; // Rien à envoyer

        const newMessage = {
            discussionIndex: activeDiscussion,
        };

        if (selectedFile) {
            // Lire et envoyer le fichier
            const reader = new FileReader();
            reader.onload = (e) => {
                newMessage.file = {
                    name: selectedFile.name,
                    type: selectedFile.type,
                    content: e.target.result,
                };

                ws.current.send(JSON.stringify(newMessage));

                setDiscussions((prevDiscussions) => {
                    const updatedDiscussions = [...prevDiscussions];
                    updatedDiscussions[activeDiscussion].messages.push(
                        <a href={newMessage.file.content} download={selectedFile.name}>
                            📎 {selectedFile.name}
                        </a>
                    );
                    return updatedDiscussions;
                });

                setSelectedFile(null); // Réinitialiser le fichier
                setMessage(''); // Réinitialiser l'input de message
            };
            reader.readAsDataURL(selectedFile);
        } else {
            // Envoyer un message texte normal
            newMessage.message = message;

            ws.current.send(JSON.stringify(newMessage));

            setDiscussions((prevDiscussions) => {
                const updatedDiscussions = [...prevDiscussions];
                updatedDiscussions[activeDiscussion].messages.push(message);
                return updatedDiscussions;
            });

            setMessage(''); // Réinitialiser l'input de message
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null); // Supprimer le fichier sélectionné
        setMessage(''); // Réinitialiser l'input de message
    };


    const handleAttachFile = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file); // Stocker le fichier sélectionné
        setMessage(`📎 ${file.name}`); // Afficher le nom du fichier dans l'input de message
    };

    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    const handleStartVideoCall = () => {
        setIsVideoModalOpen(true); // Ouvrir le modal vidéo
    };


    const handleCloseVideoModal = () => {
        setIsVideoModalOpen(false);
    };

    const handleEndCall = () => {
        if (connection) {
            connection.close();
        }
        setRemoteStream(null);
        setConnection(null);
        onClose();  // Fermer le modal après avoir terminé l'appel
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
                            onClick={() => handleDiscussionClick(index)}
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
                                    activeDiscussion === index
                                        ? discussion.messages[discussion.messages.length - 1]
                                        : 'Aucune nouvelle'
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
                        <IconButton onClick={() => handleStartVideoCall()}>
                            <VideoCall />
                        </IconButton>
                        <VideoCallModal
                            isOpen={isVideoModalOpen}
                            onClose={handleCloseVideoModal}  // Passer la fonction qui ferme le modal
                            peerId="your-peer-id"
                            idToCall="remote-peer-id"
                        />


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
                    <IconButton color="primary" onClick={() => fileInputRef.current.click()}>
                        <AttachFile />
                    </IconButton>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleAttachFile}
                    />


                    {/* Champ de saisie */}
                    <TextField
                        variant="outlined"
                        placeholder="Aa"
                        size="small"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        sx={{ paddingRight: selectedFile ? 4 : 0 }}
                    />

                    {selectedFile && (
                        <IconButton
                            size="small"
                            onClick={handleRemoveFile}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#f00',
                            }}
                        >
                            ✖
                        </IconButton>
                    )}

                    {/* Bouton d'envoi */}
                    <IconButton color="primary" onClick={handleSendMessage}>
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

export function VideoCallModal({ isOpen, onClose, peerId, idToCall }) {
    const [remoteStream, setRemoteStream] = useState(null);
    const videoRef = useRef(null);
    const localVideoRef = useRef(null);
    const [peer, setPeer] = useState(null);
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        const peerInstance = new Peer(peerId, {
            host: 'localhost',
            port: 3000,
            path: '/peerjs',
        });
        setPeer(peerInstance);

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localVideoRef.current.srcObject = stream;

                if (idToCall) {
                    const call = peerInstance.call(idToCall, stream);
                    setConnection(call);

                    call.on('stream', (remoteStream) => {
                        setRemoteStream(remoteStream);
                        videoRef.current.srcObject = remoteStream;
                    });
                }

                peerInstance.on('call', (call) => {
                    call.answer(stream);
                    call.on('stream', (remoteStream) => {
                        setRemoteStream(remoteStream);
                        videoRef.current.srcObject = remoteStream;
                    });
                });
            });

        return () => {
            peerInstance.destroy();
        };
    }, [isOpen, idToCall, peerId]);

    const handleEndCall = () => {
        if (connection) {
            connection.close();
        }
        setRemoteStream(null);
        setConnection(null);
        onClose();  // Fermer le modal après avoir terminé l'appel
    };

    return (
        <Dialog open={isOpen} fullWidth maxWidth="md">
            <Box sx={{ position: 'relative', padding: 2, textAlign: 'center' }}>
                <Typography variant="h6">Appel Vidéo</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                        marginTop: 2,
                    }}
                >
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        style={{
                            width: '45%',
                            borderRadius: 8,
                            border: '2px solid #ddd',
                        }}
                    ></video>
                    <video
                        ref={videoRef}
                        autoPlay
                        style={{
                            width: '45%',
                            borderRadius: 8,
                            border: '2px solid #ddd',
                        }}
                    ></video>
                </Box>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleEndCall}
                    sx={{ marginTop: 2 }}
                >
                    Terminer l'appel
                </Button>
            </Box>
        </Dialog>
    );
}

