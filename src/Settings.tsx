import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import { update } from './slices/settings';
import { RootState } from './store';

const formDataSchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard']),
  showTimer: z.boolean(),
  symbols: z.enum(['numbers', 'emojis']),
});

type FormData = z.infer<typeof formDataSchema>;

function SettingsPage() {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { handleSubmit, register } = useForm<FormData>({
    defaultValues: settings,
    resolver: zodResolver(formDataSchema),
  });

  function onSubmit(data: FormData) {
    dispatch(update(data));
    navigate('/');
  }

  return (
    <>
      <h1>{t('settings.title')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <fieldset>
          <legend className="form__legend">{t('difficulty')}</legend>
          <div className="form__fields">
            <div className="form__field">
              <label htmlFor="easy">{t('easy')}</label>
              <input id="easy" type="radio" value="easy" {...register('difficulty')} />
            </div>
            <div className="form__field">
              <label htmlFor="medium">{t('medium')}</label>
              <input id="medium" type="radio" value="medium" {...register('difficulty')} />
            </div>
            <div className="form__field">
              <label htmlFor="hard">{t('hard')}</label>
              <input id="hard" type="radio" value="hard" {...register('difficulty')} />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend className="form__legend">{t('symbols')}</legend>
          <div className="form__fields">
            <div className="form__field">
              <label htmlFor="easy">{t('emojis')}</label>
              <input id="emojis" type="radio" value="emojis" {...register('symbols')} />
            </div>
            <div className="form__field">
              <label htmlFor="numbers">{t('numbers')}</label>
              <input id="numbers" type="radio" value="numbers" {...register('symbols')} />
            </div>
          </div>
        </fieldset>
        <div className="form__field">
          <label htmlFor="showTimer">{t('settings.showTimer')}</label>
          <input type="checkbox" {...register('showTimer')} />
        </div>
        <div>
          <button type="submit" className="button">
            {t('settings.save')}
          </button>
        </div>
      </form>
      <p>
        <Link to="../">{t('back')}</Link>
      </p>
    </>
  );
}

export default SettingsPage;
