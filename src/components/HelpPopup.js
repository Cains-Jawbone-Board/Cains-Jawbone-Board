import React from "react";

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
};

const crossStyle = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem'
}

export default class HelpPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            page: 1,

            pagesComponents: [
                <Box>
                    <h3>Hi, welcome! 👋</h3>
                    <p>Thank you for giving this a try 😃 If there is anything that does not work as intended or if you have any ideas to improve the board please let me know! You can use this <a href="https://discord.gg/k9VGnFrpgE">Discord Server!</a></p>
                    <p>⚠️ It is important to understand that any under circumstances, your progress will be available to me or any other person. Each one is able to save the current progress locally on its own computer as explained in a few pages.</p>
                </Box>,

                <Box>
                    <h3>How does the board work? 🤔</h3>
                    <p>By clicking with the mouse left button on a circle with a number, you can see the respective text. Below you will also find the sections that you can <b>currently</b> use to highlight sections of the text.</p>
                    <p>You can also drag the circles (using the mouse left button) if you prefer to rearrange them!</p>
                </Box>,

                <Box>
                    <h3>Highlight Text? 🖍️</h3>
                    <p>Yes! If you select any section of a page's text, a tooltip with the symbol of each of the categories will show up! After clicking on it, you can give a name to that entry and it will show up behind the respective section!</p>
                </Box>,

                <Box>
                    <h3>Can I make searches? 🔍</h3>
                    <p>On the top of the page, is a search bar that can be used to search for specific words on the pages. If a page contains that text, it will stay black. Otherwise, the color will change to grey.</p>
                </Box>,

                <Box>
                    <h3>How do I save my progress? 💾</h3>
                    <p>At the top right of the webpage you can see two icons with arrows. The first one will be used in order to load the work previously done and saved. The second one will start the download of a file that should be later introduced on a new session.</p>
                </Box>,

                <Box>
                    <h3>What is coming next?</h3>
                    <p>Currently, I'm working on:</p>
                    <ul>
                        <li>Allow to search for the entries that you created</li>
                        <li>When selecting one of the entries below the page's text, highlight the text above</li>
                        <li>Allow to draw arrows between two different pages</li>
                    </ul>

                    <p>If you have any more ideas, please do not hesitate to suggest them! 😃 Good luck everyone!</p>
                </Box>
            ]
        };
    }

    toogleOpen() {
        this.setState({ open: !this.state.open });
    }

    render() {
        return (
            <Box>
                <Modal open={this.state.open}>
                    <Box sx={style}>
                        {
                            this.state.pagesComponents[this.state.page - 1]
                        }

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <IconButton aria-label="previous" onClick={() => this.setState({ page: this.state.page - 1 })} disabled={this.state.page === 1}>
                                <ArrowBackIosRoundedIcon />
                            </IconButton>

                            <p>Page {this.state.page}/{this.state.pagesComponents.length}</p>

                            <IconButton aria-label="next" onClick={() => this.setState({ page: this.state.page + 1 })} disabled={this.state.page === this.state.pagesComponents.length}>
                                <ArrowForwardIosRoundedIcon />
                            </IconButton>
                        </Box>

                        <IconButton sx={crossStyle} aria-label="close" onClick={() => this.toogleOpen()}>
                            <CloseRoundedIcon />
                        </IconButton>
                    </Box>
                </Modal>
            </Box>
        )
    }
}