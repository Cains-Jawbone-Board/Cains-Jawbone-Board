import React from 'react';

import { Box } from '@mui/material';

export default class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: props.board,
            highlight: props.highlight,

            page: props.page,
            x: props.x,
            y: props.y,

            size: props.size || 50,
            dx: 0,
            dy: 0,

            textColor: props.textColor || "black",
            backgroundColor: props.backgroundColor || "white",
        };
    }

    getCoords(from = false) {
        if (from) {
            return {
                x: this.state.x + this.state.size,
                y: this.state.y + this.state.size / 2
            };
        } else {
            return {
                x: this.state.x,
                y: this.state.y + this.state.size / 2
            };
        }
    }

    getMargins() {
        return [this.state.x, this.state.y];
    }

    setDragDeviation(e) {
        this.setState({
            dx: e.pageX - this.state.x,
            dy: e.pageY - this.state.y
        });
    }

    updateCoords(x, y) {
        this.setState({
            x: x,
            y: y
        });
    }

    updateDragCoords(e) {
        this.setState({
            x: e.pageX - this.state.dx,
            y: e.pageY - this.state.dy
        }, () => this.state.board.updateArrows(this.state.page));
    }

    endDragCoords(e) {
        this.setState({
            x: e.pageX - this.state.dx,
            y: e.pageY - this.state.dy
        }, () => this.state.board.updateArrows(this.state.page, true));
    }

    changeHighlight(highlight) {
        this.setState({ highlight: highlight });
    }

    render() {
        return (
            <Box
                draggable
                onDragStart={(e) => this.setDragDeviation(e)}
                onDrag={(e) => this.updateDragCoords(e)}
                onDragEnd={(e) => this.endDragCoords(e)}
                onClick={() => this.state.board.openDrawer(this.state.page)}
                style={{
                    opacity: this.state.highlight ? 1 : 0.5,
                    position: 'absolute',
                    marginLeft: this.state.x,
                    marginTop: this.state.y,
                    border: '1px solid black',
                    borderRadius: '50%',

                    width: `${this.state.size}px`,
                    height: `${this.state.size}px`,
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    lineHeight: `${this.state.size}px`,
                    cursor: 'pointer',
                    userSelect: 'none',

                    color: this.state.textColor,
                    backgroundColor: this.state.backgroundColor,
                }}>
                    <b>{this.state.page}</b>
            </Box>
        );
    }
}