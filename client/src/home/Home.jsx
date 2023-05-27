import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// import { userActions } from '_store';

export { Home };

function Home() {
    const dispatch = useDispatch();
    const { user: authUser } = useSelector(x => x.auth);
    const { users } = useSelector(x => x.users);

    useEffect(() => {
        // dispatch(userActions.getAll());
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-gray-100 py-8 px-4">
          <h1 className="text-3xl font-bold mb-4">Hi {authUser?.firstName}!</h1>
        </div>
    );
}
