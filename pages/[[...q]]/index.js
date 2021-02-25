import 'bootstrap/dist/css/bootstrap.css';

import { useRouter } from 'next/router';

import Songs from '../../components/songs';
import Header from '../../components/header';

export async function getServerSideProps({ params }) {
  let [pageOrInitialSearch, page] = params.q || [];

  if (page) {
    page = parseInt(page, 10);
  } else if (parseInt(pageOrInitialSearch, 10) > 0) {
    page = parseInt(pageOrInitialSearch, 10);
    pageOrInitialSearch = null;
  }

  return {
    props: {
      initialSearch: pageOrInitialSearch || null,
      page: page || 1
    }
  };
}

export default function App({ initialSearch, page }) {
  const router = useRouter();

  const performSearch = newSearch => {
    newSearch = encodeURIComponent(newSearch);
    router.replace({ pathname: `/${newSearch}` });
  };

  return (
    <main>
      <Header performSearch={performSearch} initialSearch={initialSearch} />

      <div className="py-5 bg-light">
        <div className="container">
          <Songs search={initialSearch} page={page} />
        </div>
      </div>
    </main>
  );
}
