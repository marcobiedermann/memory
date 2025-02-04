import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { update } from './slices/settings';
import { RootState } from './store';

const formDataSchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard']),
  showTimer: z.boolean(),
  symbols: z.enum(['numbers', 'emojies']),
});

type FormData = z.infer<typeof formDataSchema>;

function SettingsPage() {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);

  const { handleSubmit, register } = useForm<FormData>({
    defaultValues: settings,
    resolver: zodResolver(formDataSchema),
  });

  function onSubmit(data: FormData) {
    dispatch(update(data));
  }

  return (
    <>
      <h1>Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div>
          <legend className="form__legend">Difficulty</legend>
          <div className="form__fields">
            <div className="form__field">
              <label htmlFor="easy">Easy</label>
              <input id="easy" type="radio" value="easy" {...register('difficulty')} />
            </div>
            <div className="form__field">
              <label htmlFor="medium">Medium</label>
              <input id="medium" type="radio" value="medium" {...register('difficulty')} />
            </div>
            <div className="form__field">
              <label htmlFor="hard">Hard</label>
              <input id="hard" type="radio" value="hard" {...register('difficulty')} />
            </div>
          </div>
        </div>
        <div>
          <legend className="form__legend">Symbols</legend>
          <div className="form__fields">
            <div className="form__field">
              <label htmlFor="easy">Emojies</label>
              <input id="emojies" type="radio" value="emojies" {...register('symbols')} />
            </div>
            <div className="form__field">
              <label htmlFor="numbers">Numbers</label>
              <input id="numbers" type="radio" value="numbers" {...register('symbols')} />
            </div>
          </div>
        </div>
        <div className="form__field">
          <label htmlFor="showTimer">Show Timer</label>
          <input type="checkbox" {...register('showTimer')} />
        </div>
        <div>
          <button type="submit" className="button">
            Save Settings
          </button>
        </div>
      </form>
      <p>
        <Link to="/">Back</Link>
      </p>
    </>
  );
}

export default SettingsPage;
