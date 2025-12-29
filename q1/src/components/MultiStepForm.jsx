import React, { useReducer } from 'react';

const initialState = {
  step: 1,
  formData: {
    name: '',
    email: '',
    username: '',
    password: '',
  },
  errors: {},
  isSubmitted: false,
};

function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: '' },
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    case 'PREVIOUS_STEP':
      return { ...state, step: state.step - 1 };
    case 'SUBMIT_FORM':
      return { ...state, isSubmitted: true };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

const MultiStepForm = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { step, formData, errors, isSubmitted } = state;

  const validateStep = () => {
    let currentErrors = {};
    if (step === 1) {
      if (!formData.name.trim()) currentErrors.name = 'Name is required';
      if (!/\S+@\S+\.\S+/.test(formData.email)) currentErrors.email = 'Invalid email format';
    } else if (step === 2) {
      if (formData.username.length < 3) currentErrors.username = 'Username must be more than 3 characters';
      if (formData.password.length < 6) currentErrors.password = 'Password must be more than 6 characters';
    }

    if (Object.keys(currentErrors).length > 0) {
      dispatch({ type: 'SET_ERRORS', payload: currentErrors });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) dispatch({ type: 'NEXT_STEP' });
  };

  const isNextDisabled = () => {
    if (step === 1) return !formData.name || !formData.email;
    if (step === 2) return !formData.username || !formData.password;
    return false;
  };

  if (isSubmitted) {
    return (
      <div className="form-container">
        <h2>Success! ✅</h2>
        <p>Registration completed for {formData.name}.</p>
        <button className="btn reset" onClick={() => dispatch({ type: 'RESET_FORM' })}>Register Another</button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="progress-bar-container">
        <div className="progress-text">Step {step} of 3</div>
        <div className="progress-bg">
          <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
      </div>

      <div className="form-card">
        {step === 1 && (
          <div className="step-content">
            <h3>Step 1: Personal Details</h3>
            <input 
              type="text" placeholder="Name" 
              value={formData.name}
              onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value })}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
            
            <input 
              type="email" placeholder="Email" 
              value={formData.email}
              onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'email', value: e.target.value })}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h3>Step 2: Account Details</h3>
            <input 
              type="text" placeholder="Username" 
              value={formData.username}
              onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'username', value: e.target.value })}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
            
            <input 
              type="password" placeholder="Password" 
              value={formData.password}
              onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'password', value: e.target.value })}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h3>Step 3: Review & Submit</h3>
            <div className="review-box">
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Username:</strong> {formData.username}</p>
            </div>
          </div>
        )}

        <div className="button-group">
          {step > 1 && (
            <button className="btn secondary" onClick={() => dispatch({ type: 'PREVIOUS_STEP' })}>Back</button>
          )}
          
          {step < 3 ? (
            <button 
              className="btn primary" 
              onClick={handleNext} 
              disabled={isNextDisabled()}
            >
              Next
            </button>
          ) : (
            <button className="btn submit" onClick={() => dispatch({ type: 'SUBMIT_FORM' })}>Submit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;