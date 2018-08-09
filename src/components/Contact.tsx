import 'font-awesome/css/font-awesome.min.css';
import * as React from "react";
import '../styles/Contact.scss';


function Contact({clear}: { clear: any }) {
    return (
        <div className='contact'>
            <div className='close'>
                <a onClick={clear} href="#" className="close-button"/>
            </div>
            <div className='contact-form'>
                <div id="myModal" className="modal">
                    <div onClick={closeModal} className="modal-content">
                        <p>I'm sorry. My email sender stopped working. Please send message directly to my email: jakubpradzynski@gmail.com</p>
                    </div>
                </div>
                <h3>Contact Form</h3>
                <div className="container">
                    <form>
                        <label htmlFor="first-name">First Name</label>
                        <input type="text" className="first-name" id="first-name" placeholder="Your name.."/>

                        <label htmlFor="email">Email</label>
                        <input type="email" className="email" id="email" placeholder="Your email.."/>

                        <label htmlFor="message">Message</label>
                        <textarea className="message" id="message" placeholder="Write message.."/>

                        <input className='submit' value="Submit" onClick={sendEmail}/>
                    </form>
                </div>
            </div>
            <div className='social-media'>
                <h2>Social media</h2>
                <div className="social__container">

                    <div className="social__item">
                        <a target="_blank" href="https://www.linkedin.com/in/jakubpradzynski/"
                           className="social__icon--linkedin"><i className="icon--linkedin"/></a>
                    </div>

                    <div className="social__item">
                        <a target="_blank" href="https://twitter.com/PradzynskiJakub"
                           className="social__icon--twitter"><i className="icon--twitter"/></a>
                    </div>

                    <div className="social__item">
                        <a target="_blank" href="https://plus.google.com/u/0/100943113197886397819"
                           className="social__icon--googleplus"><i className="icon--googleplus"/></a>
                    </div>

                    <div className="social__item">
                        <a target="_blank" href="https://www.facebook.com/jakub.pradzynski" className="social__icon--facebook"><i
    className="icon--facebook"/></a>
                    </div>

                    <div className="social__item">
                        <a target="_blank" href="https://www.instagram.com/jakubpradzynski/" className="social__icon--instagram"><i
    className="icon--instagram"/></a>
                    </div>

                    <div className="social__item">
                        <a target="_blank" href="https://github.com/jakubpradzynski/" className="social__icon--github"><i
    className="icon--github"/></a>
                    </div>

                </div>
            </div>
        </div>
    );
}

function sendEmail() {
    const modal = document.getElementById('myModal') as HTMLElement;
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById('myModal') as HTMLElement;
    modal.style.display = "none";
}

export default Contact;