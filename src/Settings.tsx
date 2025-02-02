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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <legend>Difficulty</legend>
          <div>
            <div>
              <label htmlFor="easy">Easy</label>
              <input
                id="easy"
                type="radio"
                value="easy"
                className={`difficulty-btn ${settings.difficulty === 'easy' ? 'active' : ''}`}
                {...register('difficulty')}
              />
            </div>
            <div>
              <label htmlFor="medium">Medium</label>
              <input
                id="medium"
                type="radio"
                value="medium"
                className={`difficulty-btn ${settings.difficulty === 'medium' ? 'active' : ''}`}
                {...register('difficulty')}
              />
            </div>
            <div>
              <label htmlFor="hard">Hard</label>
              <input
                id="hard"
                type="radio"
                value="hard"
                className={`difficulty-btn ${settings.difficulty === 'hard' ? 'active' : ''}`}
                {...register('difficulty')}
              />
            </div>
          </div>
        </div>
        <div>
          <legend>Symbols</legend>
          <div>
            <div>
              <label htmlFor="easy">Emojies</label>
              <input id="emojies" type="radio" value="emojies" {...register('symbols')} />
            </div>
            <div>
              <label htmlFor="numbers">Numbers</label>
              <input id="numbers" type="radio" value="numbers" {...register('symbols')} />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="showTimer">Show Timer</label>
          <input type="checkbox" {...register('showTimer')} />
        </div>
        <div>
          <button type="submit">Save Settings</button>
        </div>
      </form>
      <Link to="/">Back</Link>
    </>
  );
}

export default SettingsPage;
