import { useState } from 'react';
import Head from 'next/head';
import { FiSend, FiCheck } from 'react-icons/fi';

import styles from '../styles/Index.module.css';
import Axios from 'axios';

export default function Home() {
  const [send, setSend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [name, setName] = useState('');
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !to || !subject || !content) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    setDisabled(true);
    setSend(true);

    try {
      setErrorMsg('');
      var timeout = setTimeout(async () => {
        setIsLoading(true);

        try {
          await Axios.post('/api/mail', {
            name,
            to,
            subject,
            content,
          });
          setIsLoading(false);
          setSent(true);
          setSend(false);
          setDisabled(false);
        } catch (error) {
          reset();
          setErrorMsg('Error sending email.');
        }

        setTimeout(() => reset(), 5000);
      }, 2800);
    } catch (error) {
      clearTimeout(timeout);
    }
  }

  function reset() {
    setDisabled(false);
    setIsLoading(false);
    setSent(false);
    setSend(false);
  }

  return (
    <>
      <Head>
        <title>Email sender</title>
      </Head>
      <div className={styles.container}>
        <main>
          <div className={styles.logo}>
            <img src="./assets/mail.png" alt="mail-logo" />
          </div>
          <form id="form" onSubmit={handleSubmit}>
            <h3>Email sender</h3>
            <h6>Send a email to your friends!</h6>
            <input
              type="text"
              id="name"
              placeholder="Your name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              id="recipient"
              placeholder="Email to"
              onChange={(e) => setTo(e.target.value)}
            />
            <input
              type="text"
              id="subject"
              placeholder="Subject"
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea
              type="text"
              id="content"
              placeholder="Content"
              onChange={(e) => setContent(e.target.value)}
            />

            <button
              type="submit"
              id="send"
              disabled={disabled}
              className={sent ? styles.sent : null}
              onMouseEnter={sent ? reset : () => {}}
            >
              <span style={send || isLoading ? { display: 'none' } : {}}>
                {sent ? 'Email sent!' : 'Send'}
              </span>
              {(() => {
                if (!sent) {
                  if (isLoading) {
                    return (
                      <img
                        src="./assets/loader.svg"
                        alt="loader"
                        style={{ width: '22px', height: '22px', margin: 0 }}
                      />
                    );
                  } else {
                    return (
                      <FiSend
                        className={send ? styles.send : null}
                        size={18}
                        color="#fff"
                      />
                    );
                  }
                }
              })()}
              {sent && <FiCheck size={18} color="#fff" />}
            </button>

            <span className={styles.error}>{errorMsg}</span>
          </form>
        </main>
      </div>
    </>
  );
}
