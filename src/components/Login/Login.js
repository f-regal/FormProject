import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';
import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';



const emailReducer = (state, action) => {
  //We are checking when the User Input changed, and when it did, we are updating our states for value and validity with the payload from the action 'action.val'
  if (action.type === 'USER_INPUT') {
    return {value: action.val, isValid: action.val.includes('@')};
  }
  //We are checking if input lost focust, then returning the previous state snapshot if it did
  if (action.type === 'INPUT_BLUR') {
    return {value: state.value, isValid: state.value.includes('@')};
  }
  return {value: '', isValid: false};
};

const passwordReducer = (state, action) => {
  //We are checking when the User Input changed, and when it did, we are updating our states for value and validity with the payload from the action 'action.val'
  if (action.type === 'USER_INPUT_PASS') {
    return {value: action.val, isValid: action.val.trim().length > 6};
  }
  //We are checking if input lost focust, then returning the previous state snapshot if it did
  if (action.type === 'INPUT_BLUR') {
    return {value: state.value, isValid: state.value.trim().length > 6};
  }
  return {value: '', isValid: false};
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  //const [enteredPassword, setEnteredPassword] = useState('');
  //const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);
  const [emailState, dispatchEmail] = useReducer(emailReducer, {value: '', isValid: null});
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {value: '', isValid: null});

  //So the reason why the login is still disabled is because, the useEffect only ran once, on the first keystroke of the email, because that triggered a rerender, meaning formIsValid is still false
  //We need it to run every time the email and password is changed so that we get to the end of the email and password AND THEN we setFormIsValid and then the login button will be enabled.
  // setFormIsValid runs once, when the app first renders. It checks the condition once. We need it to check the condition for every keystroke, so we need to put enteredEmail
  // and enteredPassword as dependencies so that the useEffect code runs once the app re-renders IF those dependencies change (which they will on every keystroke)
   

  const AuthCtx = useContext(AuthContext);
  const {isValid: emailIsValid} = emailState;
  const {isValid: passwordIsValid} = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Checking Form Validity')
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 500);

    return () => {
      console.log('Cleanup');
      clearTimeout(identifier)

    }
  }, [emailIsValid, passwordIsValid])
  

  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT', val: event.target.value})

    setFormIsValid(
      event.target.value.includes('@') && passwordState.value.trim().length > 6
    );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type: 'USER_INPUT_PASS', val: event.target.value})

    setFormIsValid(
      emailState.isValid && event.target.value.trim().length > 6
    );
  };

  const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'INPUT_BLUR_PASS'})
  };

  
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      AuthCtx.onLogin(emailState.value, passwordState.value);
    } else if(!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };


  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        
        <Input ref={emailInputRef} label="E-mail" id="email" type="email" isValid={emailIsValid} value={emailState.value} onChange={emailChangeHandler} onBlur={validateEmailHandler}/>
        <Input ref={passwordInputRef} label="Password" id="password" type="password" isValid={passwordIsValid} value={passwordState.value} onChange={passwordChangeHandler} onBlur={validatePasswordHandler}/>
        
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
     
      </form>
    </Card>
  );
};

export default Login;
