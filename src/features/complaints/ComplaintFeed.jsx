import React, { useEffect, useState } from 'react';
import { MessageSquare, RefreshCw } from 'lucide-react';
import { complaintService } from './complaintService.js';
import { supabase } from '../../lib/supabase.js';

export function ComplaintFeed() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadComplaints = async () => {
    try {
      setError('');

      const data = await complaintService.getForAgency();

      setComplaints(data);
    } catch (err) {
      console.error('Failed to load complaints:', err);
      setError('Unable to load citizen complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();

    const channel = supabase
      .channel('agency-citizen-complaints')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'citizen_complaints',
        },
        (payload) => {
          setComplaints((current) => [
            payload.new,
            ...current,
          ]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'citizen_complaints',
        },
        (payload) => {
          setComplaints((current) =>
            current.map((item) =>
              item.id === payload.new.id
                ? payload.new
                : item
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateStatus = async (complaint, status) => {
    try {
      const updated = await complaintService.updateStatus(
        complaint.id,
        status
      );

      setComplaints((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item
        )
      );
    } catch (err) {
      console.error('Failed to update complaint:', err);
    }
  };

  return (
    <section className="complaint-feed panel">
      <div className="panel-title">
        <span>
          <MessageSquare size={16} />
          CITIZEN QUERIES & COMPLAINTS
        </span>

        <button
          type="button"
          onClick={loadComplaints}
          title="Refresh"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {loading && (
        <div className="complaint-empty">
          Loading citizen complaints...
        </div>
      )}

      {!loading && error && (
        <div className="complaint-empty">
          {error}
        </div>
      )}

      {!loading && !error && complaints.length === 0 && (
        <div className="complaint-empty">
          No citizen complaints yet.
        </div>
      )}

      {!loading && !error && complaints.length > 0 && (
        <div className="complaint-list">
          {complaints.map((complaint) => (
            <article
              className="complaint-card"
              key={complaint.id}
            >
              <div className="complaint-card-header">
                <div>
                  <span className="complaint-category">
                    {complaint.category}
                  </span>

                  <h3>{complaint.subject}</h3>
                </div>

                <span
                  className={`complaint-status ${complaint.status
                    .toLowerCase()
                    .replaceAll(' ', '-')}`}
                >
                  {complaint.status}
                </span>
              </div>

              <p className="complaint-description">
                {complaint.description}
              </p>

              <div className="complaint-meta">
                <span>
                  {complaint.citizen_name || 'Citizen'}
                </span>

                <span>
                  {complaint.district || 'Unknown district'}
                  {complaint.state
                    ? `, ${complaint.state}`
                    : ''}
                </span>

                <span>
                  {new Date(
                    complaint.created_at
                  ).toLocaleString()}
                </span>
              </div>

              <div className="complaint-actions">
                {complaint.status === 'Pending' && (
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        complaint,
                        'Acknowledged'
                      )
                    }
                  >
                    Acknowledge
                  </button>
                )}

                {complaint.status === 'Acknowledged' && (
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        complaint,
                        'In Progress'
                      )
                    }
                  >
                    Start Processing
                  </button>
                )}

                {complaint.status === 'In Progress' && (
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        complaint,
                        'Resolved'
                      )
                    }
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}