import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTeamForm } from '../hooks/useTeamForm';
import { TeamForm } from '../components/Editor/TeamForm';
import type { TeamEditorData } from '../types/editor';

export default function TeamFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = id !== undefined && id !== 'new';

  const [initialValues, setInitialValues] = useState<Partial<TeamEditorData>>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load existing team data when editing
  useEffect(() => {
    if (!isEdit) return;
    fetch(`/api/teams/${id}`)
      .then(r => r.json())
      .then((data: TeamEditorData) => setInitialValues(data))
      .catch(() => setLoadError('Failed to load team.'));
  }, [id, isEdit]);

  const { form, setField, isSubmitting, submitError, submit } = useTeamForm({
    initialValues,
    teamId: isEdit ? id : undefined,
  });

  if (loadError) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400">
        {loadError}
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
      <div className="mb-6">
        <Link
          to={isEdit ? `/editor/teams/${id}` : '/editor'}
          className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-zinc-100 mt-3">
          {isEdit ? 'Edit Team' : 'New Team'}
        </h1>
      </div>
      <TeamForm
        form={form}
        onField={setField}
        onSubmit={submit}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitLabel={isEdit ? 'Save Changes' : 'Create Team'}
      />
    </div>
  );
}
