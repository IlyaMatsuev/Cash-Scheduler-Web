import React, {useRef} from 'react';
import {Grid} from 'semantic-ui-react';
import {useSprings, animated} from 'react-spring';
import {useDrag} from 'react-use-gesture';
import NewWalletButton from './NewWalletButton/NewWalletButton';
import WalletItem from './WalletItem/WalletItem';
import colors from '../colors';


const WalletList = ({wallets, onNewWallet, onWalletSelected, onWalletsTransfer}) => {
    const columnsCount = 6;
    const gridRef = useRef(null);
    let allowItemClick = false;
    let sourceTransferWallet;
    let targetTransferWallet;

    const getDragStyles = ({xys}) => ({
        xys, zIndex: 2, shadow: 10, cursor: 'grabbing', immediate: true
    });

    const getDropStyles = () => ({
        xys: [0, 0, 1.1], zIndex: 1, cursor: 'pointer', shadow: 10
    });

    const getDefaultStyles = () => ({
        xys: [0, 0, 1], zIndex: 1, shadow: 0, cursor: 'pointer', immediate: false
    });

    const springSetter = (originalIndex, dropIndex, down, styles) => {
        return i => {
            if (down) {
                if (originalIndex === i) {
                    return getDragStyles(styles);
                }
                if (dropIndex === i) {
                    return getDropStyles();
                }
            }
            return getDefaultStyles();
        };
    };

    const [springs, setSprings] = useSprings(wallets.length, springSetter());

    const dragBind = useDrag(({args: [index], down, movement}) => {
        const [x, y] = movement;
        // Getting approximate width and height of each wallet item including their margins
        const itemRect = getItemSize();
        // Getting possible column index of the element under the mouse
        const nextColumnIndex = Math.round((x + itemRect.width) / itemRect.width) - 1 + index;
        // Getting possible row index of the element under the mouse
        const nextRowIndex = Math.round((y + itemRect.height) / itemRect.height) - 1;

        let dropItemIndex;
        // Getting possible index of the hovered wallet
        const possibleNextItemIndex = nextRowIndex * columnsCount + nextColumnIndex;
        if (index !== possibleNextItemIndex && possibleNextItemIndex >= 0 && wallets.length > possibleNextItemIndex) {
            dropItemIndex = possibleNextItemIndex;
        }

        if (dropItemIndex || dropItemIndex === 0) {
            sourceTransferWallet = wallets[index];
            targetTransferWallet = wallets[dropItemIndex];
        } else {
            sourceTransferWallet = null;
            targetTransferWallet = null;
        }

        setSprings(springSetter(index, dropItemIndex, down, {xys: [...movement, 1.1]}));
        allowItemClick = !down && movement[0] === 0 && movement[1] === 0;
    });

    const getItemSize = () => {
        return {
            width: gridRef.current.getBoundingClientRect().width / columnsCount,
            // Divide on the number of actual rows since Grid doesn't have height as 100%
            height: gridRef.current.getBoundingClientRect().height / Math.ceil((wallets.length + 1) / columnsCount)
        };
    };

    const getItemColor = i => {
        while (colors.length < i) {
            i -= colors.length;
        }
        return colors[i];
    }

    const onItemClick = wallet => {
        if (allowItemClick) {
            onWalletSelected(wallet);
        } else if (sourceTransferWallet && targetTransferWallet) {
            onWalletsTransfer(sourceTransferWallet, targetTransferWallet);
        }
    };


    return (
        <div ref={gridRef}>
            <Grid columns={columnsCount}>
                <NewWalletButton onClick={onNewWallet}/>
                {springs.map(({xys, zIndex, shadow, cursor}, i) => {
                    const animatedStyles = {
                        transform: xys.interpolate((x, y, s) => `translate3d(${x}px, ${y}px, 0) scale(${s})`),
                        boxShadow: shadow.interpolate(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
                        zIndex,
                        cursor
                    };
                    return (
                        <Grid.Column key={i}>
                            <animated.div {...dragBind(i)} style={animatedStyles} className="position-relative">
                                <WalletItem key={wallets[i].id} color={getItemColor(i)}
                                            wallet={wallets[i]} onWalletSelected={onItemClick}
                                />
                            </animated.div>
                        </Grid.Column>
                    );
                })}
            </Grid>
        </div>
    );
};

export default WalletList;
