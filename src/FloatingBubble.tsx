import React from 'react';
import './FloatingBubble.css';  // CSSファイルをインポート

interface FloatingBubbleProps {
    text: string;
}

const FloatingBubble: React.FC<FloatingBubbleProps> = ({ text }) => {
    return (
        <div className="floating-bubble">
            {text}
        </div>
    );
};

export default FloatingBubble;
