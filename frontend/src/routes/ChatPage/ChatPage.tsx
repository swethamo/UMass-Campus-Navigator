import { Typography } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import "./ChatPage.css";

const markdownComponents: Partial<Components> = {
  a: ({ href, children, ...props }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ),
};

const initialMessage = `
Hi, I can answer any questions about the buildings on the UMass Amherst campus. How can I help!
`;

function ChatPage() {
  const chatState = useAppSelector((state) => state.chat);
  const isLoading = chatState?.response === "%%loading%%";

  return (
    <div className="chat-page">
      <div className="chat-container">
        <Typography variant="body1" className="bot-container">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {initialMessage}
          </ReactMarkdown>
        </Typography>
        {chatState && chatState.message && (
          <Typography variant="body1" className="user-container">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {chatState.message}
            </ReactMarkdown>
          </Typography>
        )}
        {chatState && chatState.response && (
          <Typography
            variant="body1"
            className={`bot-container ${isLoading ? "loading-animation" : ""}`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {isLoading ? "Thinking..." : chatState.response}
            </ReactMarkdown>
          </Typography>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
