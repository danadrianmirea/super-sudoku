import React from 'react';
import { SudokuSmall, SudokuSmallTitle, SmallGridLineY, SmallGridLineX } from 'src/components/modules/Sudoku/modules';
import {Cell} from 'src/ducks/sudoku/model';

export default class SmallSudokuComponent extends React.PureComponent<{
  sudoku: Cell[];
  id: number;
  darken?: boolean;
  elevation?: number;
  onClick: () => any;
}> {
  render() {
    const {sudoku, id, onClick, darken} = this.props;
    const height = 150;
    const width = 150;
    const fontSize = 8;

    const xSection = height / 9;
    const ySection = width / 9;
    const fontXOffset = xSection / 2 - 2;
    const fontYOffset = ySection / 2 - 4;

    return (
      <div>
         <div
          style={{
            background: `rgba(255, 255, 255, ${darken ? 0.5 : 0})`,
            transition: 'background 500ms ease-out',
            top: 0,
            left: 0,
            height,
            width,
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: 6,
          }}
        />
        <SudokuSmall
          onClick={onClick}
          style={{
            height,
            width,
            fontSize,
            lineHeight: fontSize + 'px',
          }}
        >
          <SudokuSmallTitle>
            {id}
          </SudokuSmallTitle>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
            const makeBold = i % 3 === 0;
            const lineWidth = makeBold ? 2 : 1;
            const background = makeBold ? '#AAAAAA' : '#EEEEEE';
            return (
              <SmallGridLineX
                key={i}
                height={lineWidth}
                width={width}
                top={i * height / 9 - lineWidth / 2}
                background={background}
              />
            );
          })}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
            const makeBold = i % 3 === 0;
            const lineWidth = makeBold ? 2 : 1;
            const background = makeBold ? '#AAAAAA' : '#EEEEEE';
            return (
              <SmallGridLineY
                key={i}
                height={height}
                width={lineWidth}
                left={i * height / 9 - lineWidth / 2}
                background={background}
              />
            );
          })}
          {sudoku.map((c, i) => {
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: xSection * c.x + fontXOffset,
                  top: ySection * c.y + fontYOffset,
                }}
              >
                {c.number}
              </div>
            );
          })}
        </SudokuSmall>
      </div>
    );
  }
}
