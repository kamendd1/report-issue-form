'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from '../styles/Form.module.css';

const issueTypes = [
  { label: 'Charging session issues (Required Charger Label and/or location)', value: 'charging_session' },
  { label: 'Payment issues', value: 'payment' },
  { label: 'Autocharge issue', value: 'autocharge' },
  { label: 'RFID issue', value: 'rfid' },
  { label: 'Account validation issues', value: 'account_validation' },
  { label: 'Inaccurate charger position on the map (Required Charger Label and/or location)', value: 'inaccurate_position' },
  { label: 'Charger is not available/unfunctional (Required Charger Label or connector)', value: 'unavailable_charger' },
  { label: 'Damaged charger/connector (Required Charger Label & connector)', value: 'damaged_charger' },
  { label: 'Wrong Charger Power Capacity in the App (Required Charger Label and/or location)', value: 'wrong_power_capacity' },
  { label: 'Wrong Connector Type in the App (Required Charger Label and/or location)', value: 'wrong_connector_type' },
  { label: 'Missing/Wrong price information in the App (Required Charger Label and/or location / Related Tariff AC/DC)', value: 'wrong_price_info' },
  { label: 'Other issue (Please specify)', value: 'other' },
];

const operators = [
  { label: 'Select an operator', value: '' },
  { label: 'RO', value: 'RO' },
  { label: 'LT', value: 'LT' },
  { label: 'BG', value: 'BG' },
];

// Helper function to check if issue type requires charger info
const requiresChargerInfo = (type) => {
  return [
    'charging_session',
    'inaccurate_position',
    'unavailable_charger',
    'damaged_charger',
    'wrong_power_capacity',
    'wrong_connector_type',
    'wrong_price_info'
  ].includes(type);
};

// Helper function to check if issue type requires connector info
const requiresConnectorInfo = (type) => {
  return [
    'unavailable_charger',
    'damaged_charger',
    'wrong_connector_type'
  ].includes(type);
};

// Form validation schema using Yup
const schema = yup.object().shape({
  operator: yup.string().required('Operator is required'),
  issueType: yup.string().required('Issue type is required'),
  otherIssueDescription: yup.string().when('issueType', {
    is: 'other',
    then: () => yup.string().required('Please specify the issue').min(10, 'Please provide at least 10 characters'),
    otherwise: () => yup.string()
  }),
  chargerLabel: yup.string().when('issueType', {
    is: (val) => requiresChargerInfo(val),
    then: () => yup.string().required('Charger label is required'),
    otherwise: () => yup.string()
  }),
  chargerLocation: yup.string().when('issueType', {
    is: (val) => requiresChargerInfo(val),
    then: () => yup.string().required('Charger location is required'),
    otherwise: () => yup.string()
  }),
  connectorType: yup.string().when('issueType', {
    is: (val) => requiresConnectorInfo(val),
    then: () => yup.string().required('Connector type is required'),
    otherwise: () => yup.string()
  }),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  dateOfIssue: yup.string().required('Date of issue is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  stationId: yup.string(),
  description: yup.string().required('Description is required')
    .min(20, 'Description must be at least 20 characters'),
  name: yup.string().required('Name is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  location: yup.string().required('Location is required'),
  consent: yup.boolean().oneOf([true], 'You must agree to the terms'),
});

export default function ReportIssueForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      operator: '',
      issueType: '',
      otherIssueDescription: '',
      chargerLabel: '',
      chargerLocation: '',
      connectorType: '',
      email: '',
      dateOfIssue: '',
      stationId: '',
      description: '',
      name: '',
      phoneNumber: '',
      location: '',
      consent: false,
    },
  });
  
  // Watch the issueType to conditionally show fields
  const selectedIssueType = watch('issueType');

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/submit-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Redirect to success page with ticket number
        router.push(`/success?ticket=${result.ticketNumber}`);
      } else {
        throw new Error(result.error || 'Failed to submit issue');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Report an Issue</h2>
      <p>
        Having trouble with the Eldrive services? We're here to help! This form allows you to quickly report any
        issues you encounter while using the app.
      </p>
      
      <h3>Before you report:</h3>
      <ul>
        <li>
          Check our Help Center: Many common issues can be resolved by reviewing the FAQ. You can
          find them within the app or by visiting our <a href="#" className={styles.link}>Help page</a>.
        </li>
        <li>
          Restart the app: Sometimes, a simple restart can fix temporary glitches.
        </li>
      </ul>
      
      <h3>Ready to report?</h3>
      <p>
        Please fill out the form below with as much detail as possible. This will help us identify and resolve the
        issue faster.
      </p>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.formGroup}>
          <Controller
            name="operator"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="operator">
                  Operator <span className={styles.required}>*</span>
                </label>
                <select
                  {...field}
                  id="operator"
                  className={`${styles.select} ${errors.operator ? styles.errorInput : ''}`}
                >
                  {operators.map((operator) => (
                    <option key={operator.value} value={operator.value}>
                      {operator.label}
                    </option>
                  ))}
                </select>
              </>
            )}
          />
          {errors.operator && <span className={styles.error}>{errors.operator.message}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <Controller
            name="issueType"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="issueType">
                  Issue Type <span className={styles.required}>*</span>
                </label>
                <select
                  {...field}
                  id="issueType"
                  className={`${styles.select} ${errors.issueType ? styles.errorInput : ''}`}
                >
                  <option value="">Select an issue type</option>
                  {issueTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </>
            )}
          />
          {errors.issueType && <span className={styles.error}>{errors.issueType.message}</span>}
        </div>
        
        {/* Show additional field for "Other issue" */}
        {selectedIssueType === 'other' && (
          <div className={styles.formGroup}>
            <Controller
              name="otherIssueDescription"
              control={control}
              render={({ field }) => (
                <>
                  <label htmlFor="otherIssueDescription">
                    Please specify the issue <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    {...field}
                    id="otherIssueDescription"
                    className={`${styles.textarea} ${errors.otherIssueDescription ? styles.errorInput : ''}`}
                    placeholder="Please provide details about your issue"
                  />
                </>
              )}
            />
            {errors.otherIssueDescription && <span className={styles.error}>{errors.otherIssueDescription.message}</span>}
          </div>
        )}
        
        {/* Show charger information fields for issue types that require it */}
        {requiresChargerInfo(selectedIssueType) && (
          <>
            <div className={styles.chargerInfo}>
              This issue type requires charger information
            </div>
            
            <div className={styles.formGroup}>
              <Controller
                name="chargerLabel"
                control={control}
                render={({ field }) => (
                  <>
                    <label htmlFor="chargerLabel">
                      Charger Label <span className={styles.required}>*</span>
                    </label>
                    <input
                      {...field}
                      type="text"
                      id="chargerLabel"
                      className={`${styles.input} ${errors.chargerLabel ? styles.errorInput : ''}`}
                      placeholder="Enter the charger label (found on the charger)"
                    />
                  </>
                )}
              />
              {errors.chargerLabel && <span className={styles.error}>{errors.chargerLabel.message}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <Controller
                name="chargerLocation"
                control={control}
                render={({ field }) => (
                  <>
                    <label htmlFor="chargerLocation">
                      Charger Location <span className={styles.required}>*</span>
                    </label>
                    <input
                      {...field}
                      type="text"
                      id="chargerLocation"
                      className={`${styles.input} ${errors.chargerLocation ? styles.errorInput : ''}`}
                      placeholder="Enter the charger location with as much detail as possible"
                    />
                  </>
                )}
              />
              {errors.chargerLocation && <span className={styles.error}>{errors.chargerLocation.message}</span>}
            </div>
          </>
        )}
        
        {/* Show connector information field for issue types that require it */}
        {requiresConnectorInfo(selectedIssueType) && (
          <div className={styles.formGroup}>
            <Controller
              name="connectorType"
              control={control}
              render={({ field }) => (
                <>
                  <label htmlFor="connectorType">
                    Connector Type <span className={styles.required}>*</span>
                  </label>
                  <input
                    {...field}
                    type="text"
                    id="connectorType"
                    className={`${styles.input} ${errors.connectorType ? styles.errorInput : ''}`}
                    placeholder="e.g., CCS, CHAdeMO, Type 2"
                  />
                </>
              )}
            />
            {errors.connectorType && <span className={styles.error}>{errors.connectorType.message}</span>}
          </div>
        )}
        
        <div className={styles.formGroup}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="name">
                  Name <span className={styles.required}>*</span>
                </label>
                <input
                  {...field}
                  type="text"
                  id="name"
                  className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
                  placeholder="Enter your name"
                />
              </>
            )}
          />
          {errors.name && <span className={styles.error}>{errors.name.message}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="email">
                  Email Address <span className={styles.required}>*</span>
                </label>
                <input
                  {...field}
                  type="email"
                  id="email"
                  className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
                  placeholder="Enter your email address"
                />
              </>
            )}
          />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="phoneNumber">
                  Phone Number <span className={styles.required}>*</span>
                </label>
                <input
                  {...field}
                  type="tel"
                  id="phoneNumber"
                  className={`${styles.input} ${errors.phoneNumber ? styles.errorInput : ''}`}
                  placeholder="Enter your phone number"
                />
              </>
            )}
          />
          {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber.message}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="location">
                  Location <span className={styles.required}>*</span>
                </label>
                <input
                  {...field}
                  type="text"
                  id="location"
                  className={`${styles.input} ${errors.location ? styles.errorInput : ''}`}
                  placeholder="Enter the location"
                />
              </>
            )}
          />
          {errors.location && <span className={styles.error}>{errors.location.message}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <Controller
            name="dateOfIssue"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="dateOfIssue">
                  Date of Issue <span className={styles.required}>*</span>
                </label>
                <input
                  {...field}
                  type="date"
                  id="dateOfIssue"
                  className={`${styles.input} ${errors.dateOfIssue ? styles.errorInput : ''}`}
                  max={new Date().toISOString().split('T')[0]}
                />
              </>
            )}
          />
          {errors.dateOfIssue && <span className={styles.error}>{errors.dateOfIssue.message}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <Controller
            name="stationId"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="stationId">
                  Station ID <span className={styles.optional}>(optional)</span>
                </label>
                <input
                  {...field}
                  type="text"
                  id="stationId"
                  className={styles.input}
                  placeholder="Enter the station ID (found on a label at the station)"
                />
              </>
            )}
          />
        </div>
        
        <div className={styles.formGroup}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="description">
                  Describe the Issue <span className={styles.required}>*</span>
                </label>
                <textarea
                  {...field}
                  id="description"
                  className={`${styles.textarea} ${errors.description ? styles.errorInput : ''}`}
                  placeholder="Please provide a clear and detailed description of the problem you're experiencing"
                  rows={4}
                />
                <small>The more information you give us, the easier it will be for us to diagnose and fix the issue</small>
              </>
            )}
          />
          {errors.description && <span className={styles.error}>{errors.description.message}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label>
            <svg 
              className={styles.icon} 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Screenshots or Photos <span className={styles.optional}>(optional)</span>
          </label>
          <div className={styles.fileInputWrapper}>
            <button type="button" className={styles.fileButton} onClick={() => document.getElementById('screenshots').click()}>
              Choose Files
            </button>
            <span className={styles.fileText}>No files selected</span>
            <input
              id="screenshots"
              type="file"
              multiple
              onChange={(e) => {
                const fileCount = e.target.files?.length || 0;
                const fileText = document.querySelector(`.${styles.fileText}`);
                if (fileText) {
                  fileText.textContent = fileCount === 0 
                    ? 'No files selected' 
                    : fileCount === 1 
                      ? '1 file selected'
                      : `${fileCount} files selected`;
                }
              }}
              className={styles.input}
            />
          </div>
          <small>Attach any screenshots or photos that may help illustrate the issue</small>
        </div>
        
        <div className={styles.formGroup}>
          <Controller
            name="consent"
            control={control}
            render={({ field }) => (
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  id="consent"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                <label htmlFor="consent">By checking this box, you consent to Eldrive processing your personal data as described in our <a href="#" className={styles.link}>Privacy Policy</a> for the purpose of addressing your reported issue and you agree to be contacted for updates. You may withdraw your consent at any time.</label>
              </div>
            )}
          />
          {errors.consent && <span className={styles.error}>{errors.consent.message}</span>}
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Issue'}
        </button>
      </form>
      
      {snackbar.open && (
        <div className={`${styles.alert} ${snackbar.severity === 'error' ? styles.alertError : styles.alertSuccess}`}>
          {snackbar.message}
        </div>
      )}
      
      {submitStatus.message && (
        <div className={`${styles.alert} ${submitStatus.type === 'error' ? styles.alertError : styles.alertSuccess}`}>
          {submitStatus.message}
        </div>
      )}
    </div>
  );
};
