import React from "react";

import { styled } from '@mui/material/styles';

import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import EastIcon from '@mui/icons-material/East';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
  }));

export default class PageDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            width: props.width,
            screen: props.screen,
            sections: {},
            connection: 0,

            tooltip: false,
            tooltipX: 0,
            tooltipY: 0,

            page: 1,
            text: "",

            selectedText: "",
        };

        this.tooltip = React.createRef();
    }

    setPageDetails(page, text, sections, connection) {
        this.setState({
            page: page,
            text: text,
            sections: sections,
            tooltip: false,
            connection: connection,
        });
    }

    updateSections(sections) {
        this.setState({
            sections: sections,
        });
    }

    handleDrawerOpen() {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false, tooltip: false });
        this.state.screen.handleDrawerClose();
    };

    checkIfTextSelected(e) {
        // e.stopPropagation();
        var text = "";
        if (typeof window.getSelection !== "undefined") {
            text = window.getSelection().toString();
        }

        if (text !== "") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var range = sel.getRangeAt(0).cloneRange();
                if (range.getClientRects) {
                    range.collapse(true);
                    var rects = range.getClientRects();
                    var rect = rects[0];
                    var x = rect.left;
                    var x2 = rect.right;
                    var y = rect.top;
                    
                    this.setState({ selectedText: text })
                    this.showPop((x + x2) / 2, y);
                }
            }
        } else {
            this.setState({
                tooltip: false,
            })
        }
    }

    showPop(x, y) {
        var finalX = x - (window.innerWidth - this.state.width) - 50;
        if (finalX < 0) finalX = 0;
        else if (finalX > 180) finalX = 180;

        var finalY = y - 25;

        this.setState({
            tooltip: true,
            tooltipX: finalX,
            tooltipY: finalY,
        })
    }

    createBook() {
        this.state.screen.createBook(this.state.page, this.state.selectedText);
    }

    createCharacter() {
        this.state.screen.createCharacter(this.state.page, this.state.selectedText);
    }

    createLocation() {
        this.state.screen.createLocation(this.state.page, this.state.selectedText);
    }

    createDate() {
        this.state.screen.createDate(this.state.page, this.state.selectedText);
    }

    createNote() {
        this.state.screen.createNote(this.state.page, this.state.selectedText);
    }

    getUniqueEntries(arr) {
        var uniqueEntries = [];
        for (var i = 0; i < arr.length; i++) {
            if (!uniqueEntries.includes(arr[i]["Entry"])) {
                uniqueEntries.push(arr[i]["Entry"]);
            }
        }
        return uniqueEntries;
    }

    nextPageChanged(e) {
        this.state.screen.createConnection(this.state.page, e.target.value);
        this.setState({
            connection: e.target.value,
        })
    }

    render() {
        return (
            <Drawer
                sx={{
                width: this.state.width,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: this.state.width,
                    boxSizing: 'border-box',
                },
                }}
                variant="persistent"
                anchor="right"
                open={this.state.open}
                // onMouseUp={() => {this.setState({tooltip: false})}}
            >   
                {
                    this.state.tooltip &&
                    <Box
                        ref={this.tooltip}
                        style={{
                            display: 'flex',
                            displayDirection: 'row',
                            position: 'absolute',
                            width: '200px',
                            height: '25px',
                            border: '1px solid black',
                            borderRadius: '5px',
                            marginLeft: this.state.tooltipX,
                            marginTop: this.state.tooltipY,
                            backgroundColor: 'white',
                        }}
                    >
                        <IconButton
                            sx={{color: "#0c255e"}}
                            onClick={() => this.createBook()}
                        >
                            <MenuBookRoundedIcon />
                        </IconButton>
                        <IconButton
                            sx={{color: "#117701"}}
                            onClick={() => this.createCharacter()}    
                        >
                            <PersonRoundedIcon />
                        </IconButton>
                        <IconButton
                            sx={{color: "#e6b400"}}
                            onClick={() => this.createDate()}    
                        >
                            <CalendarMonthRoundedIcon />
                        </IconButton>
                        <IconButton
                            sx={{color: "#f58216"}}
                            onClick={() => this.createLocation()}    
                        >
                            <LocationOnRoundedIcon />
                        </IconButton>
                        <IconButton
                            sx={{color: "#e2619f"}}
                            onClick={() => this.createNote()}
                        >
                            <NotesRoundedIcon />
                        </IconButton>

                    </Box>
                }


                <DrawerHeader>
                    <Box sx={{display: 'flex', flexDirection: 'row', flexGrow: 1, alignItems: 'center'}}>
                        <h3>Page {this.state.page}</h3>
                        <Icon sx={{marginLeft: '10px', marginRight: '10px'}}><EastIcon /></Icon>
                        <h3>Page </h3>
                        <Select value={this.state.connection ? this.state.connection : 0} sx={{marginLeft: '10px'}} size="small" onChange={(e) => this.nextPageChanged(e)}>
                            <MenuItem value={0}>None</MenuItem>
                            {
                                Array.from({length: 100}, (_, i) => i + 1).map((page) => {
                                    if (page !== this.state.page) {
                                        return (
                                            <MenuItem key={page} value={page}>{page}</MenuItem>
                                        )
                                    }
                                    return null;
                                })
                            }
                        </Select>
                    </Box>
                    <IconButton onClick={() => this.handleDrawerClose()}>
                        <CloseRoundedIcon />
                    </IconButton>
                </DrawerHeader>
                <Box
                    sx={{
                        marginLeft: '15px',
                        marginRight: '15px',
                    }}>

                    <Divider />

                    <h3>Text</h3>
                    <Box
                        onMouseUp={(e) => this.checkIfTextSelected(e)}
                        sx={{
                            fontSize: '12px',
                            textAlign: 'justify',
                        }}
                    >
                        {this.state.text}
                    </Box>

                    <Divider />

                    <Box
                        sx={{
                            display: 'flex',
                            displayDirection: 'row', 
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            color: "#0c255e"
                        }}
                    >
                        <Icon>
                            <MenuBookRoundedIcon />
                        </Icon>
                        <p style={{marginLeft: '10px'}}><b>Literature</b></p>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        displayDirection: 'row',
                        flexWrap: 'wrap',
                        marginBottom: '10px',
                        fontSize: '12px',
                    }}>
                        {
                            this.state.sections && this.state.sections["Literature"]
                            ? this.getUniqueEntries(this.state.sections["Literature"] || []).map((section, index) => {
                                return (
                                    <div key={index} style={{padding: 5, marginRight: '10px', border: '1px solid black', borderRadius: '10px'}}>
                                        <span>{section}</span>
                                    </div>
                                )
                            })
                            : null
                        }
                    </Box>


                    <Divider />

                    <Box
                        sx={{
                            display: 'flex',
                            displayDirection: 'row', 
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            color: "#117701"
                        }}
                    >
                        <Icon>
                            <PersonRoundedIcon />
                        </Icon>
                        <p style={{marginLeft: '10px'}}><b>Characters</b></p>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        displayDirection: 'row',
                        flexWrap: 'wrap',
                        marginBottom: '10px',
                        fontSize: '12px',
                    }}>
                        {
                            this.state.sections && this.state.sections["Characters"]
                            ? this.getUniqueEntries(this.state.sections["Characters"] || []).map((section, index) => {
                                return (
                                    <div key={index} style={{padding: 5, marginRight: '10px', border: '1px solid black', borderRadius: '10px'}}>
                                        <span>{section}</span>
                                    </div>
                                )
                            })
                            : null
                        }
                    </Box>

                    <Divider />

                    <Box
                        sx={{
                            display: 'flex',
                            displayDirection: 'row', 
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            color: "#e6b400"
                        }}
                    >
                        <Icon>
                            <CalendarMonthRoundedIcon />
                        </Icon>
                        <p style={{marginLeft: '10px'}}><b>Dates</b></p>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        displayDirection: 'row',
                        flexWrap: 'wrap',
                        marginBottom: '10px',
                        fontSize: '12px',
                    }}>
                        {
                            this.state.sections && this.state.sections["Dates"]
                            ? this.getUniqueEntries(this.state.sections["Dates"] || []).map((section, index) => {
                                return (
                                    <div key={index} style={{padding: 5, marginRight: '10px', border: '1px solid black', borderRadius: '10px'}}>
                                        <span>{section}</span>
                                    </div>
                                )
                            })
                            : null
                        }
                    </Box>

                    <Divider />

                    <Box
                        sx={{
                            display: 'flex',
                            displayDirection: 'row', 
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            color: "#f58216"
                        }}
                    >
                        <Icon>
                            <LocationOnRoundedIcon />
                        </Icon>
                        <p style={{marginLeft: '10px'}}><b>Locations</b></p>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        displayDirection: 'row',
                        flexWrap: 'wrap',
                        marginBottom: '10px',
                        fontSize: '12px',
                    }}>
                        {
                            this.state.sections && this.state.sections["Locations"]
                            ? this.getUniqueEntries(this.state.sections["Locations"] || []).map((section, index) => {
                                return (
                                    <div key={index} style={{padding: 5, marginRight: '10px', border: '1px solid black', borderRadius: '10px'}}>
                                        <span>{section}</span>
                                    </div>
                                )
                            })
                            : null
                        }
                    </Box>

                    <Divider />

                    <Box
                        sx={{
                            display: 'flex',
                            displayDirection: 'row', 
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            color: "#e2619f"
                        }}
                    >
                        <Icon>
                            <NotesRoundedIcon />
                        </Icon>
                        <p style={{marginLeft: '10px'}}><b>Other Notes</b></p>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        displayDirection: 'row',
                        flexWrap: 'wrap',
                        marginBottom: '10px',
                        fontSize: '12px',
                    }}>
                        {
                            this.state.sections && this.state.sections["Other Notes"]
                            ? this.getUniqueEntries(this.state.sections["Other Notes"] || []).map((section, index) => {
                                return (
                                    <div key={index} style={{padding: 5, marginRight: '10px', border: '1px solid black', borderRadius: '10px'}}>
                                        <span>{section}</span>
                                    </div>
                                )
                            })
                            : null
                        }
                    </Box>
                </Box>
            </Drawer>
        )
    }
}