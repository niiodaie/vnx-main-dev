import { Router, Request, Response } from 'express';

const router = Router();

router.get('/tools', (_req: Request, res: Response) => {
  res.json([
    {
      id: 1,
      name: 'Surprise Ideas Generator',
      slug: 'vnx-surprise',
      description: 'Generate personalized surprise ideas for any occasion.',
      link: '/tools/vnx-surprise',
    },
    {
      id: 2,
      name: 'Netlookup',
      slug: 'vnx-netlookup',
      description: 'Lookup IP, DNS, and domain info quickly.',
      link: '/tools/vnx-netlookup',
    },
    {
      id: 3,
      name: 'PlayChaCha',
      slug: 'playchacha',
      description: 'P2P prediction & betting platform.',
      link: '/platforms/playchacha',
    }
  ]);
});

export default router;
