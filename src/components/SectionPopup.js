import React from "react";

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from "@mui/material/FormControl";
import { InputLabel } from "@mui/material";
import Button from '@mui/material/Button';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
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

export default class SectionPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            page: 0,
            section: "",
            screen: props.screen,
            selectedText: "",

            filters: [],

            entry: "",
            dropOption: ""
        };

        this.textField = React.createRef();
        this.dropdown = React.createRef();
    }

    toogleOpen() {
        this.setState({ open: !this.state.open });
    }

    updateFields(page, section, selectedText, filters) {
        this.setState({
            page: page,
            section: section,
            selectedText: selectedText,
            filters: filters
        });
    }

    updateEntry(e) {
        this.setState({ entry: e.target.value });
    }

    updateDropdown(e) {
        this.setState({ dropOption: e.target.value });
    }

    createEntry() {
        var entry = this.state.entry;
        var option = this.state.dropOption;

        var name = "";

        if (entry === "" && option === "") {
            return;
        } else if (option !== "") {
            name = option;
        } else if (entry !== "") {
            name = entry;
        }

        this.state.screen.createSection(this.state.page, this.state.section, name, this.state.selectedText);
        this.toogleOpen();
    }

    render() {
        return (
            <Box>
                <Modal open={this.state.open}>
                    <Box sx={style}>
                        <h3>Create a new Entry</h3>
                        <span variant="h5">Section: <i>{this.state.section}</i></span>
                        <br />
                        <span variant="h6">Selected Text: <i>{this.state.selectedText}</i></span>

                        <p><b>Create a new entry</b></p>
                        <TextField onChange={(e) => this.updateEntry(e)} ref={this.textField} variant="outlined" label="Entry..." fullWidth />

                        <p><b>Or choose an existing one</b></p>
                        <FormControl fullWidth>
                            <InputLabel>Entry</InputLabel>
                            <Select ref={this.dropdown} value={this.state.dropOption ? this.state.dropOption : ""} onChange={(e) => this.updateDropdown(e)}>
                                {
                                    this.state.filters.map((filter, index) => {
                                        return (
                                            <MenuItem value={filter} key={index}>{filter}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>

                        <Button sx={{marginTop: '1rem'}} variant="contained" onClick={() => this.createEntry()}>Save Entry</Button>

                        <IconButton sx={crossStyle} aria-label="close" onClick={() => this.toogleOpen()}>
                            <CloseRoundedIcon />
                        </IconButton>
                    </Box>
                </Modal>
            </Box>
        )
    }
}