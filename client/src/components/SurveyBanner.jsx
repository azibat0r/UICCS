import { useEffect, useState } from 'react';
import { useUser } from '../context/useUser.js';
import { API_URL } from '../config.js';

export default function SurveyBanner() {
  const { user } = useUser();
  const [survey, setSurvey] = useState(user ? undefined : null);
  const [expanded, setExpanded] = useState(false);
  const [foundInternshipOpportunity, setFoundInternshipOpportunity] = useState(null);
  const [easierToStayConsistent, setEasierToStayConsistent] = useState(null);
  const [overallRating, setOverallRating] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/api/survey/mine`, { credentials: 'include' })
      .then((res) => res.json())
      .then(setSurvey)
      .catch(() => setSurvey(null));
  }, [user]);

  async function handleSubmit() {
    setError('');
    if (
      foundInternshipOpportunity === null ||
      easierToStayConsistent === null ||
      !overallRating
    ) {
      setError('Please answer all three questions.');
      return;
    }

    setSubmitting(true);
    const res = await fetch(`${API_URL}/api/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ foundInternshipOpportunity, easierToStayConsistent, overallRating }),
    });
    setSubmitting(false);

    if (!res.ok) {
      setError('Something went wrong. Try again.');
      return;
    }

    const data = await res.json();
    setSurvey(data);
  }

  if (!user || survey === undefined || survey) return null;

  return (
    <div className="border-b border-(--color-border) bg-(--color-surface)">
      <div className="mx-auto max-w-6xl px-6 py-3">
        {!expanded ? (
          <div className="flex items-center justify-between gap-4 text-sm">
            <p className="text-(--color-text-muted)">
              Got 30 seconds? A quick 3-question survey helps us understand PathToSWE's impact.
            </p>
            <button
              onClick={() => setExpanded(true)}
              className="shrink-0 rounded-md bg-(--color-accent) px-3 py-1.5 text-xs font-medium text-(--color-bg) hover:opacity-90 transition"
            >
              Take Survey
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-2">
            <div>
              <p className="text-sm mb-2">
                Have you discovered an internship opportunity through PathToSWE you likely
                wouldn't have found otherwise?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setFoundInternshipOpportunity(true)}
                  className={`rounded-md border px-4 py-1.5 text-sm transition ${
                    foundInternshipOpportunity === true
                      ? 'border-(--color-accent) bg-(--color-accent)/10'
                      : 'border-(--color-border)'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setFoundInternshipOpportunity(false)}
                  className={`rounded-md border px-4 py-1.5 text-sm transition ${
                    foundInternshipOpportunity === false
                      ? 'border-(--color-accent) bg-(--color-accent)/10'
                      : 'border-(--color-border)'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm mb-2">
                Has joining a study group made it easier to stay consistent with your coding
                practice?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setEasierToStayConsistent(true)}
                  className={`rounded-md border px-4 py-1.5 text-sm transition ${
                    easierToStayConsistent === true
                      ? 'border-(--color-accent) bg-(--color-accent)/10'
                      : 'border-(--color-border)'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setEasierToStayConsistent(false)}
                  className={`rounded-md border px-4 py-1.5 text-sm transition ${
                    easierToStayConsistent === false
                      ? 'border-(--color-accent) bg-(--color-accent)/10'
                      : 'border-(--color-border)'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm mb-2">On a scale of 1-5, how would you rate PathToSWE overall?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setOverallRating(n)}
                    className={`h-9 w-9 rounded-md border text-sm transition ${
                      overallRating === n
                        ? 'border-(--color-accent) bg-(--color-accent)/10'
                        : 'border-(--color-border)'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-(--color-accent) text-sm">{error}</p>}

            <div className="flex gap-2">
              <button
                onClick={() => setExpanded(false)}
                className="rounded-md border border-(--color-border) px-4 py-2 text-sm hover:border-(--color-accent) transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-md bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}