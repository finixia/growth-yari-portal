import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Briefcase, Tag } from 'lucide-react';

interface SignupFormProps {
  onSignup: (userData: {
    name: string;
    email: string;
    password: string;
    profession: string[];
    skills: string[];
  }) => void;
  onSwitchToLogin: () => void;
  loading: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onSwitchToLogin, loading }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: [] as string[],
    skills: [] as string[]
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [professionInput, setProfessionInput] = useState('');

  const professions = [
    'Business Coach',
    'Tech Developer',
    'Designer',
    'Marketing',
    'Product Manager',
    'Consultant',
    'Entrepreneur',
    'Data Scientist',
    'Sales Expert'
  ];

  const commonSkills = [
    'Leadership', 'Project Management', 'Strategic Planning', 'Data Analysis',
    'Digital Marketing', 'Software Development', 'UX/UI Design', 'Sales',
    'Customer Success', 'Product Management', 'Business Development',
    'Financial Analysis', 'Operations Management', 'Team Building',
    'Communication', 'Problem Solving', 'Innovation', 'Agile/Scrum'
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        alert('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
    }
    setStep(2); // ✅ Only two steps now
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 2) return; // ✅ Only submit on step 2

    if (formData.profession.length === 0) {
      alert("Please select at least one profession");
      return;
    }

    onSignup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      profession: formData.profession,
      skills: formData.skills
    });
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addProfession = (profession: string) => {
    if (profession && !formData.profession.includes(profession)) {
      setFormData(prev => ({ ...prev, profession: [...prev.profession, profession] }));
    }
    setProfessionInput('');
  };

  const removeProfession = (professionToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      profession: prev.profession.filter(p => p !== professionToRemove)
    }));
  };

 

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Join GrowthYari</h2>
          <p className="text-gray-600">Create your professional network</p>

          {/* Progress Indicator */}
        {/* Progress Indicator */}
<div className="flex items-center justify-center mt-4 space-x-2">
  {[1, 2].map((stepNum) => (
    <div key={stepNum} className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
        step >= stepNum ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-600'
      }`}>
        {stepNum}
      </div>
      {stepNum < 2 && (
        <div className={`w-8 h-1 mx-2 ${step > stepNum ? 'bg-brand-primary' : 'bg-gray-200'}`} />
      )}
    </div>
  ))}
</div>
<div className="mt-2 text-sm text-gray-500">
  Step {step} of 2: {step === 1 ? 'Basic Information' : 'Profession & Skills'}
</div>

        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              {/* Profession */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title/Profession *</label>
                <div className="flex flex-wrap gap-2">
                  {professions.map((profession) => (
                    <button
                      key={profession}
                      type="button"
                      onClick={() => addProfession(profession)}
                      disabled={formData.profession.includes(profession)}
                      className={`px-3 py-1 rounded-full text-sm ${formData.profession.includes(profession)
                        ? 'bg-brand-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {profession}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex space-x-2">
                  <input
                    type="text"
                    value={professionInput}
                    onChange={(e) => setProfessionInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProfession(professionInput))}
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                    placeholder="Add custom profession..."
                  />
                  <button
                    type="button"
                    onClick={() => addProfession(professionInput)}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
                {formData.profession.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.profession.map((p) => (
                      <span key={p} className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm flex items-center">
                        {p}
                        <button type="button" onClick={() => removeProfession(p)} className="ml-2">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {commonSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      disabled={formData.skills.includes(skill)}
                      className={`px-3 py-1 rounded-full text-sm ${formData.skills.includes(skill)
                        ? 'bg-brand-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex space-x-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                    placeholder="Add custom skill..."
                  />
                  <button
                    type="button"
                    onClick={() => addSkill(skillInput)}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((s) => (
                      <span key={s} className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm flex items-center">
                        {s}
                        <button type="button" onClick={() => removeSkill(s)} className="ml-2">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <button type="button" onClick={handleBack} className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                Back
              </button>
            )}

            {step < 2 ? (
              <button type="button" onClick={handleNext} className="px-6 py-2 bg-brand-primary text-white rounded-lg">
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-brand-primary text-white rounded-lg disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-brand-primary hover:text-brand-secondary font-semibold">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
